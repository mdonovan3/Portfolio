library(Microsoft365R)
library(blastula)
library(purrr)
library(stringr)

bns_order_preface1 <- "Hello "
bns_order_preface2 <- ",\n\nCan you please send the following order to Bones for Wednesday:\n\n1 case:\n\n\n"

brg_order_preface1 <- "Hello "
brg_order_preface2 <- ",\n\nCan you please send the following order to BRG for Wednesday:\n\n1 case:\n\n\n"

em_signature <- "Thank You\n\nWine Buyer"

bones_df <- data.frame(
  "Distributors" = c(
    "United", "RNDC", "Winebow", "GA Crown",
    "Empire", "Prime", "General Wholesale",
    "Savannah", "Ultimate", "RNDC", "Avant Partir", "Bon Vin", "Hemispheres", "Atlanta Beverage"
  ),
  "RepNames" = c(
    "Aaron", "Stephen", "Ashley", "Sumera", "Jamie",
    "Laura", "Kelly", "Brendan", "Jennifer", "Chelsea", "Ari", "Billy", "Hallyn", "Matthew"
  ),
  "Emails" = c(
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com", "rep@distributor.com", "rep@distributor.com"
  )
)

bones_df <- bones_df %>% dplyr::arrange(desc(Distributors), desc(RepNames))


brg_df <- data.frame(
  "Distributors" = c(
    "United", "RNDC", "Winebow", "GA Crown", "Empire",
    "Prime", "General Wholesale", "Savannah", "Ultimate", "RNDC", "Avant Partir", "Bon Vin"
  ),
  "RepNames" = c(
    "Aaron", "Jenny", "Ashley", "Sumera", "Jamie",
    "Laura", "John", "Brendan", "Jennifer", "Quin", "Ari", "Billy"
  ),
  "Emails" = c(
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com",
    "rep@distributor.com", "rep@distributor.com", "rep@distributor.com"
  )
)

brg_df <- brg_df %>% dplyr::arrange(desc(Distributors), desc(RepNames))


brg_cc   <- ""
bones_cc <- ""


outlb <- get_business_outlook(tenant = "yourtenant.com")

inbox <- outlb$get_inbox()

lapply(1:nrow(bones_df), function(r) {
  em <- outlb$create_email()
  em$set_body(paste(bns_order_preface1, bones_df[r, ]$RepNames, bns_order_preface2, em_signature, sep = ""))
  em$set_subject(paste("Bones Order - ", bones_df[r, ]$Distributors))
  em$set_recipients(to = bones_df[r, ]$Emails, bcc = bones_cc)
  print(bones_df[r, ])
})

lapply(1:nrow(brg_df), function(r) {
  em <- outlb$create_email()
  em$set_body(paste(brg_order_preface1, brg_df[r, ]$RepNames, brg_order_preface2, em_signature, sep = ""))
  em$set_subject(paste("BRG Order - ", brg_df[r, ]$Distributors))
  em$set_recipients(to = brg_df[r, ]$Emails, bcc = brg_cc)
  print(brg_df[r, ])
})


# outlb$list_emails(n=10)
