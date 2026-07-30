import { Box, Typography } from "@mui/material";
import { DetailHeader, Section, Prose, P, Callout, t } from "./tipoutOpsShared";

const TipoutOpsLoader = () => (
  <Box maxWidth="lg" sx={{ maxWidth: 1100, mx: "auto" }}>
    <DetailHeader
      title="Loader"
      status="done"
      dek="ELT, not ETL: pulls the poller's redacted grind export into Postgres with no transformation, no filtering, no renaming. dbt owns all shaping downstream — this script's only job is getting raw records into queryable tables."
      runs="cloud, nightly (GitHub Actions, not written yet)"
      stack="dlt + dbfread + psycopg2"
    />

    <Section title={'What "raw" actually means here'}>
      <Prose>
        <P>
          Every parseable *.dbf in a grind day-folder gets loaded into its own
          raw.alohadbf_&lt;table&gt; table — not a curated subset. Tables unused today may be
          needed as scope expands, so nothing is dropped at this layer.
        </P>
        <P>
          The only field type dbfread converts away from text is DATE (needed for date-based
          filtering/partitioning downstream). Numeric and logical fields stay as trimmed source
          text, not cast to int/float/bool — this sidesteps dbfread's numeric-parsing edge cases
          (e.g. EMP.SSN is actually N(19,15), not a plain integer) leaking into the raw layer. dbt
          casts each column deliberately, once someone actually knows what it means.
        </P>
      </Prose>
    </Section>

    <Section title="Dedupe-then-append idempotency">
      <Callout label="Why this exists">
        The poller blindly reprocesses a rolling 30-day window every run — the same day's zip
        gets re-uploaded to S3 night after night as long as it's in the window. Loading it naively
        every time would duplicate every row. dlt's own "merge" write disposition was tried first
        and fails against this RDS instance with a Postgres MERGE syntax error — reverted.
      </Callout>
      <Prose>
        <P>
          Fixed instead with a manual dedupe step: before loading a (entity_id, grind_date) day,
          the loader deletes any rows already loaded for that exact day from every table it's
          about to touch, then loads with dlt's plain "append" disposition. Reprocessing an
          unchanged day is safe — it just deletes and re-inserts the same rows.
        </P>
        <P>
          The dedupe query runs on its own short-lived psycopg2 connection, deliberately separate
          from dlt's own connection. An earlier version shared dlt's sql_client() and swallowed
          "table does not exist" errors without issuing a ROLLBACK — in Postgres, one failed
          statement leaves the whole transaction aborted until rolled back, which silently broke
          dlt's own CREATE TABLE calls for any table that didn't exist yet. Fixed two ways at
          once: a fully separate connection closed before dlt's pipeline ever runs, and checking
          which tables actually exist via information_schema first, so a DELETE is never attempted
          against a table that isn't there in the first place.
        </P>
      </Prose>
    </Section>

    <Section title="Status" last>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        <b style={{ color: t.slate }}>Working</b> — built and tested end-to-end against real
        grind data into the real production Postgres host (79 tables, verified row counts). Loads
        one table per pipeline.run() call rather than batching all ~150 resources into one call —
        batching hit a race in dlt's parallel job scheduler where some tables' INSERT jobs started
        before their own CREATE TABLE finished. Slower, but removes the race by construction.
        Dev/test now targets a separate tipout_scratch database, not the real lhrc_data production
        instance.
      </Typography>
    </Section>
  </Box>
);

export default TipoutOpsLoader;
