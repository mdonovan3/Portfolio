import { Box, Typography } from "@mui/material";
import { DetailHeader, Section, Prose, P, Callout, FlowDiagram, t } from "./tipoutOpsShared";

const TipoutOpsArchiver = () => (
  <Box maxWidth="lg" sx={{ maxWidth: 1100, mx: "auto" }}>
    <DetailHeader
      title="Archiver"
      status="wip"
      dek="Ages a day's export out of S3 once it's outside the mutable payroll-edit window. S3 only — never touches Postgres, and never touches anything on the POS box. The raw Aloha exports on the restaurant's own computer are permanent; nothing in this pipeline deletes them, ever."
      runs="cloud, nightly (GitHub Actions, not written yet)"
      stack="S3 only"
    />

    <Section title="The move: landing/ → archive/">
      <FlowDiagram
        steps={[
          { title: "<source>/landing/<day>.zip" },
          { title: "copy" },
          { title: "verify", subtitle: "head_object" },
          { title: "delete original" },
          { title: "<source>/archive/<day>.zip", faded: true },
        ]}
      />
      <Prose>
        <P>
          Once a day's zip is older than archive_after_days (30 — matches the poller's
          reprocess_window_days, since that's the point past which Aloha's own retroactive-edit
          window has closed), the archiver copies it from landing/ to archive/ inside the same
          bucket, confirms the copy landed with a head_object call, and only then deletes the
          landing/ original. It never deletes before it has confirmed the copy exists.
        </P>
        <P>
          This has to be a real copy+delete, not a native S3 Lifecycle Rule — lifecycle rules only
          do storage-class transitions or expiration within a key, there's no built-in way to move
          a key across prefixes.
        </P>
      </Prose>
    </Section>

    <Section title="Idempotent by construction, no state file">
      <Callout label="Same philosophy as the rest of the pipeline">
        Every run just checks S3 directly instead of trusting a local record of what it already
        did — the same "check before acting" approach as the poller's blind reprocess window and
        the loader's dedupe-then-append.
      </Callout>
      <Prose>
        <P>
          If archive/&lt;day&gt;.zip already exists — say, a prior run copied successfully but got
          killed before the delete — the copy step is skipped entirely and the run goes straight
          to deleting landing/, finishing the interrupted move. Safe to rerun against the same day
          any number of times, and a --dry-run flag logs exactly what would happen without
          touching S3, for checking a config change before it can delete anything for real.
        </P>
      </Prose>
    </Section>

    <Section title="Status" last>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        <b style={{ color: t.slate }}>Built, not run against real S3 data yet.</b> It needs its
        own scoped IAM credential — broader than the poller's write-only key, since archiving has
        to read back what it just copied and then delete the original: s3:ListBucket,
        s3:GetObject, s3:PutObject, s3:DeleteObject on both restaurant buckets. No key, and no
        equivalent key-generation script, exists yet.
      </Typography>
    </Section>
  </Box>
);

export default TipoutOpsArchiver;
