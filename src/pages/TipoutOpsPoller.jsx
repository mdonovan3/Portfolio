import { Box, Typography } from "@mui/material";
import { DetailHeader, Section, Prose, P, Callout, FlowDiagram, t } from "./tipoutOpsShared";

const TipoutOpsPoller = () => (
  <Box maxWidth="lg" sx={{ maxWidth: 1100, mx: "auto" }}>
    <DetailHeader
      title="Poller"
      status="done"
      dek="Runs on the restaurant's own POS computer — the only part of this pipeline that has to. Redacts sensitive fields in a copy of each day's Aloha grind export, zips it, and uploads it to S3. Nothing downstream ever touches the POS box."
      runs="on-prem, every 15 min (service loop) or on demand (--once)"
      stack="Python (frozen to a Windows .exe eventually)"
    />

    <Section title="What it does, end to end">
      <FlowDiagram
        steps={[
          { title: "1. Select window", subtitle: "last 30 days of dated grind folders" },
          { title: "2. Copy", subtitle: "whole folder, original untouched" },
          { title: "3. Redact", subtitle: "patch sensitive DBF fields in the copy" },
          { title: "4. Zip" },
          { title: "5. Upload", subtitle: "S3 aloha-grind/landing/<day>.zip" },
        ]}
      />
      <Prose>
        <P>
          The original Aloha export directory is opened for reading only — every redaction
          happens on a copy in a scratch staging directory, so a bug in the redaction step can
          never corrupt Aloha's own data.
        </P>
      </Prose>
    </Section>

    <Section title="The 30-day blind reprocess window">
      <Callout label="Why this exists">
        Aloha lets a manager correct a punch days after the shift — the correction rewrites that
        original business day's own already-archived DBF files in place. A day's export isn't
        actually final the moment it's first written; it can change again days later. Measured
        against real 2024 data: about 0.5% of punch-edit rows were corrected after their own
        business date (a confirmed lower bound, not the true rate).
      </Callout>
      <Prose>
        <P>
          So every single run, the poller reprocesses every dated folder from the last
          reprocess_window_days (30) — unconditionally, not just folders it hasn't seen before.
          There's no local "already done" state file, no --reprocess flag, nothing to get out of
          sync. A day either falls inside the window and gets redacted-zipped-uploaded again, or
          it's aged out and this script doesn't touch it at all.
        </P>
        <P>
          The only folder that might not be ready is the single newest one (today's, if
          end-of-day grinding hasn't finished) — everything older than that was necessarily
          already fully written by a prior day's EOD, so it skips the readiness check entirely.
          Readiness itself is checked via the GNDDBF30.XXX marker file NCR's own export spec
          documents as the "day is complete" signal, falling back to an mtime-settle heuristic if
          a POS version doesn't drop it.
        </P>
        <P>
          Reprocessing an unchanged day costs a few seconds at this data volume (~17.9M rows /
          ~9.5GB for a full year, both restaurants, all 205 tables) — trivial compared to the
          risk of silently missing a late edit. The <b>loader</b>'s dedupe-then-append
          idempotency is what makes reloading the same day safe on the Postgres side, every
          single night.
        </P>
      </Prose>
    </Section>

    <Section title="Redaction: hash the SSN, blank everything else">
      <Prose>
        <P>
          Every DBF file in the staged copy gets scanned; sensitive fields are patched in place
          by raw byte offset — no third-party DBF library, so the eventual frozen .exe only needs
          boto3.
        </P>
        <Box component="ul" sx={{ pl: 3, m: 0, color: "text.secondary" }}>
          <Typography component="li" variant="body2" sx={{ lineHeight: 1.8, mb: 1 }}>
            <b>SSN-shaped fields</b> (EMP.SSN, SSNTEXT, SSN_ENC, ADJTIME.SSN, GNDBREAK.SSN) are
            replaced with a salted SHA-256 hash, not blanked — the salt is generated once per
            store and persisted locally, so the same employee hashes to the same value across
            every run and every system. That makes it usable as a stable cross-system join key
            without ever storing or transmitting the real SSN.
          </Typography>
          <Typography component="li" variant="body2" sx={{ lineHeight: 1.8 }}>
            <b>Everything else</b> — address, phone, birthday, POS login credential hashes, guest
            cardholder name/auth code — is fully blanked or zeroed. No reversible value kept.
          </Typography>
        </Box>
        <P>
          The field lists (HASH_FIELDS / BLANK_FIELDS) are kept in sync by hand with the
          reference redaction script. A 2026-07-28 audit found real unredacted PII (guest
          cardholder names/auth codes, employee credential hashes) that an earlier version of
          this redaction list had missed — the whole repo's git history was rebuilt from a single
          clean commit afterward.
        </P>
      </Prose>
    </Section>

    <Section title="Status" last>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        <b style={{ color: t.slate }}>Working</b> — tested end-to-end against 17 real business
        days of reference grind data, zero crashes, hash/blank mechanics verified deterministic
        and structure-preserving. Not yet re-verified against the current per-restaurant bucket
        scheme or frozen into a Windows service (.exe + NSSM/Scheduled Task) — currently run
        manually via <code>python3 poller.py</code>.
      </Typography>
    </Section>
  </Box>
);

export default TipoutOpsPoller;
