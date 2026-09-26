import { Box, Typography } from "@mui/material";
import { DetailHeader, Section, Prose, P, Callout, StatRow, t } from "./tipoutOpsShared";

const TipoutOpsDbt = () => (
  <Box maxWidth="lg" sx={{ maxWidth: 1100, mx: "auto" }}>
    <DetailHeader
      title="dbt"
      status="wip"
      dek="Transforms raw POS records into the actual tip-out calculation, replacing the manager's Excel formulas. Staging and intermediate layers are built and generic to any restaurant on Aloha; the tip-out-specific marts on top haven't started."
      runs="cloud, nightly (GitHub Actions, not written yet)"
      stack="raw → staging → intermediate → marts"
    />

    <Section title="What's built so far">
      <StatRow stats={[
        { label: "staging views", value: "7 built" },
        { label: "intermediate models", value: "4 built" },
        { label: "dimension tables slated for SCD2", value: "59" },
        { label: "marts (tip-out calc)", value: "0" },
      ]} />
      <Prose>
        <P>
          <b>Staging</b> — thin typed views over the loader's raw tables: stg_aloha_emp, job,
          adjtime, gndsale, gndtndr, cat, tdr.
        </P>
        <P>
          <b>Intermediate</b> — the "always do this" joins and filters the project's own
          data-dictionary documentation establishes: int_aloha_bartenders, labor_shifts,
          net_sales_by_check, tenders. ADJTIME filtered to INVALID='N'; bartender identity
          resolved from JOBCODE1-10 against JOB.BARTENDER.
        </P>
        <P>
          None of this encodes tip-out math — it's the same Aloha data model regardless of which
          restaurant it's for, so it was built ahead of having both restaurants' business rules
          fully documented. Not yet run against a live table: column names come from the
          project's documented Aloha field reference run through dlt's naming convention, not
          verified against a real connection.
        </P>
      </Prose>
    </Section>

    <Section title="Why every dimension table gets full SCD2">
      <Callout label="The failure mode this prevents">
        Aloha lets a manager reassign a code's meaning — a PLU that meant "Filet Mignon" in July
        can mean "Lobster Tail" in August; a job code can get reassigned to a different role.
        Joining a historical shift against the current state of a dimension table silently
        misreports history once that meaning changes. For this project specifically, a job-code
        reassignment doesn't just corrupt a report — tip-out math is keyed on who worked which
        role, so it would misattribute real pay for every historical shift that used the old
        meaning.
      </Callout>
      <Prose>
        <P>
          A table-by-table measurement against a full year of real 2024 data (both restaurants,
          all 205 tables) found 54 tables that rarely change and 5 that change often enough to
          obviously need SCD2 (EMP, SUB, ITM, MNU, LAB). The natural next step was a "dedup-only"
          tier for the 54 rarely-changing tables, tracking history only for the ones judged
          human-editable and business-critical.
        </P>
        <P>
          <b>Decided against that tier entirely.</b> Measured frequency only tells you what
          happened to occur in one year of data, not what's structurally possible — a
          reassignment that never showed up in the sample is still a real risk. And SCD2 overhead
          on a near-static lookup table (dozens to a few hundred business keys) is genuinely
          small: the effective_start/effective_end/is_current columns cost almost nothing, and
          the hash-based change-detection framework already has to exist for the 5 tables that
          clearly need it. Maintaining a second dedup-only code path for "tables judged safe" is
          more total engineering than running one mechanism everywhere — and it removes an
          ongoing judgment call for every table added later.
        </P>
        <P>
          <b>Net result: all 59 dimension-like tables get SCD2</b> (change detected via a hash of
          tracked columns — same key + same hash = no new version; different hash = close out the
          old row's effective_end, open a new one). Only the 17 append-only fact tables (ADJTIME,
          the per-check GND* tables) stay outside it — they have no "current version" concept to
          begin with.
        </P>
      </Prose>
    </Section>

    <Section title="Marts — not started, and why" last>
      <Prose>
        <P>
          The actual tip-out calculation is blocked on having both restaurants' full formula
          logic mapped out first — by design, not oversight. HVG's formulas (upstairs solo
          stations vs. downstairs team pooling, headcount-tiered SA rates, bar transfer detection)
          are fully reverse-engineered from a real filled-out week. Ironstone is a genuinely
          different, team-based model and still needs a real filled-out week to see the live
          formulas — the one template found so far has no calculation logic in it at all.
        </P>
        <P>
          Once marts start, facts have to join each SCD2 dimension at the version that was valid
          at transaction time (sale_date &gt;= effective_start AND sale_date &lt; effective_end),
          not at current state — enforced through one shared join macro so there's only one place
          that logic can be wrong, plus a deliberate ad hoc escape hatch for questions no existing
          mart answers yet.
        </P>
      </Prose>
    </Section>
  </Box>
);

export default TipoutOpsDbt;
