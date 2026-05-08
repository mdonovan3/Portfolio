library(Microsoft365R)
library(dplyr)

# Generates per-distributor purchase order draft emails via Microsoft Graph API.
# One draft is created per rep per restaurant — ready to fill in order details
# and send. Authenticates via Microsoft365R (OAuth2 against M365 tenant).
#
# Pattern: build a contact dataframe, lapply over rows, create_email() for each.

# --- Contact lists -----------------------------------------------------------
# One row per distributor rep. BCC goes to the buyer's manager.

bones_df <- data.frame(
  Distributors = c("United", "RNDC", "Winebow", "GA Crown",
                   "Empire", "Prime", "General Wholesale",
                   "Savannah", "Ultimate", "Avant Partir", "Bon Vin",
                   "Hemispheres", "Atlanta Beverage"),
  RepNames     = c("Rep1", "Rep2", "Rep3", "Rep4", "Rep5",
                   "Rep6", "Rep7", "Rep8", "Rep9", "Rep10",
                   "Rep11", "Rep12", "Rep13"),
  Emails       = c("rep1@distributor1.com", "rep2@distributor2.com",
                   "rep3@distributor3.com", "rep4@distributor4.com",
                   "rep5@distributor5.com", "rep6@distributor6.com",
                   "rep7@distributor7.com", "rep8@distributor8.com",
                   "rep9@distributor9.com", "rep10@distributor10.com",
                   "rep11@distributor11.com", "rep12@distributor12.com",
                   "rep13@distributor13.com")
)

brg_df <- data.frame(
  Distributors = c("United", "RNDC", "Winebow", "GA Crown", "Empire",
                   "Prime", "General Wholesale", "Savannah", "Ultimate",
                   "Avant Partir", "Bon Vin"),
  RepNames     = c("Rep1", "Rep2", "Rep3", "Rep4", "Rep5",
                   "Rep6", "Rep7", "Rep8", "Rep9", "Rep10", "Rep11"),
  Emails       = c("rep1@distributor1.com", "rep2@distributor2.com",
                   "rep3@distributor3.com", "rep4@distributor4.com",
                   "rep5@distributor5.com", "rep6@distributor6.com",
                   "rep7@distributor7.com", "rep8@distributor8.com",
                   "rep9@distributor9.com", "rep10@distributor10.com",
                   "rep11@distributor11.com")
)

bones_bcc <- "manager@restaurant.com"
brg_bcc   <- "manager@restaurant.com"

em_signature <- "Thank You\n\nMartin Donovan\nWine Buyer"

bns_body_template <- function(rep_name) {
  paste0("Hello ", rep_name,
         ",\n\nCan you please send the following order to Bones for Wednesday:\n\n",
         "1 case:\n\n\n",
         em_signature)
}

brg_body_template <- function(rep_name) {
  paste0("Hello ", rep_name,
         ",\n\nCan you please send the following order to BRG for Wednesday:\n\n",
         "1 case:\n\n\n",
         em_signature)
}

# --- Authenticate and generate drafts ----------------------------------------
# get_business_outlook() opens an OAuth2 browser flow on first run;
# subsequent calls reuse a cached token.

outlb <- get_business_outlook(tenant = "yourcompany.com")

lapply(seq_len(nrow(bones_df)), function(r) {
  em <- outlb$create_email()
  em$set_body(bns_body_template(bones_df$RepNames[r]))
  em$set_subject(paste("Bones Order -", bones_df$Distributors[r]))
  em$set_recipients(to = bones_df$Emails[r], bcc = bones_bcc)
})

lapply(seq_len(nrow(brg_df)), function(r) {
  em <- outlb$create_email()
  em$set_body(brg_body_template(brg_df$RepNames[r]))
  em$set_subject(paste("BRG Order -", brg_df$Distributors[r]))
  em$set_recipients(to = brg_df$Emails[r], bcc = brg_bcc)
})
