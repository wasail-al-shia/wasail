import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MainWrapper from "../framework/MainWrapper";
import Subheader from "../framework/Subheader";
export default () => {
  return (
    <>
      <Subheader />
      <MainWrapper>
        <Stack
          spacing={10}
          sx={{
            backgroundColor: "primary.paper",
            marginTop: 5,
            padding: 5,
          }}
        >
          <Typography variant="h5">Wasail Al Shia</Typography>
          <Typography>
            <a
              target="_blank"
              href="https://en.wikishia.net/view/Wasa%27il_al-Shi%27a_(book)"
              rel="noreferrer"
            >
              Wasail Al Shia
            </a>{" "}
            is monumental collection of Shia hadith. Extensive in its breath and
            comprehensive in its scope, it is a colossal collection covering in
            detail every area of shia religious law. It is a super-collection
            sourced in turn from early Shia canonical books like{" "}
            <a
              target="_blank"
              href="https://en.wikishia.net/view/Four_Books"
              rel="noreferrer"
            >
              Kutub-e-Araba
            </a>{" "}
            (Four Books) and many other reputable primary sources (like Mahasin,
            Basair al Darajat, etc). It comprises of a total of 36,000 hadith
            organized into 30 volumes.
          </Typography>
          <Typography variant="h5">Shaykh Hurr Amili</Typography>
          <Typography>
            The hadiths were collected and compiled by{" "}
            <a
              target="_blank"
              href="https://en.wikishia.net/view/Al-Hurr_al-%27Amili"
              rel="noreferrer"
            >
              Shaykh al-Hurr al-Amili
            </a>{" "}
            (d. 1693), who wrote in the introduction of this book, that for a
            long he had this idea in mind, to collect narrations about sharia
            and practical laws from reliable books. He spent twenty years of his
            life to finish this compilation. This work by Shaykh Hurr Amili, is
            a significant contribution to the preservation and dissemination of
            Shia hadiths and jurisprudential teachings. May Allah elevate his
            status and reward him abundantly.
          </Typography>
          <Typography variant="h5">Translation Notes</Typography>
          <Typography>
            This site presents a translation of this important work in order to
            make the knowledge (ilm) within it accessible to the english
            speaking audience. We are careful to translate the hadith such that
            it is as faithful as possible to the original in conveying the
            meanings. Arabic is an eloquent language and for many words and
            expressions it is often impossible to find the best equivalent in
            english. In many cases and especially for well known arabic words we
            quote the transliterated form of the word directly (e.g. wilayah,
            ibaadah, aql, kufr, etc). In other cases we we offer a range of
            applicable meanings in parenthesis. For your reference the arabic
            text is provided along with the translation and you may want to
            explore other meaning patterns and possibilities. You can send us
            comments to improve a translation using the feedback/comment icon
            that is displayed next to each report. We appreciate your help and
            feedback.
          </Typography>
          <Typography>
            Note that we have left out (omitted) the transmission chains (sanad)
            from the translations to increase readability. This information can
            be looked up easily (if required) in the original arabic copies that
            are available online and can also be downloaded from this site.
          </Typography>
          <Typography variant="h5">Hadith Numbering</Typography>
          <Typography>
            The Arabic version maintains a standard sequential numbering of the
            hadith through out the entire collection, starting from 1 (in the
            first volume) and ending with 35,767 (in the last volume). The site
            also respects this numbering. Adherance to this standard makes it
            easy to lookup the equivalent hadith using its number in other
            editions or translations.
          </Typography>
          <Typography variant="h5">Site Features</Typography>
          <Typography>
            This is a dynamic website and all hadith are orgranized and indexed
            in a bi-lingual database. The site provides a search capability
            which will be improved further inshaAllah. An individual hadith can
            be copied and shared by clicking the 'Copy to Clipboard' icon next
            to each report. The site is updated with new translations on almost
            a daily basis, so please check back often. Percentage completion for
            each volume is posted on the book cover.
          </Typography>
          <Typography variant="h5">Finally</Typography>
          <Typography>
            This is a collaborative and ongoing effort and we expect it to
            continue for quite some time until we finish inshaAllah. Please
            share the website with others. Please also read the terms of website
            use below. If you have any questions or comments please feel free to
            contact us. Thank you for visiting the website and we look forward
            to your feedback.
          </Typography>
        </Stack>
        <Box mt={7} />
        <Stack spacing={5}>
          <Typography variant="termsOfUse">Terms of Website Use:</Typography>
          <Typography variant="termsOfUse">
            Please read these terms of use carefully before you start to use the
            site. By using our site, you indicate that you accept these terms of
            use and that you agree to abide by them. Accessing our site is
            permitted on a temporary basis, and we reserve the right to withdraw
            or amend the service we provide on our site without notice (see
            below). We will not be liable if for any reason our site is
            unavailable at any time or for any period. From time to time, we may
            restrict access to some parts of our site, or our entire site.
          </Typography>
          <Typography variant="termsOfUse">
            We are the owner and the licensee of all intellectual property
            rights in our site, and in the material published on it. Those works
            are protected by copyright laws and treaties around the world. All
            such rights are reserved. You may print off one copy, and may
            download extracts, of any page(s) from our site for your personal
            reference and you may draw the attention of others to material
            posted on our site. You must not modify the paper or digital copies
            of any materials you have printed off or downloaded in any way. Our
            status (and that of any identified contributors) as the authors of
            material on our site must always be acknowledged. You must not use
            any part of the materials on our site for commercial purposes
            without obtaining a licence to do so from us . If you print off,
            copy or download any part of our site in breach of these terms of
            use, your right to use our site will cease immediately and you must,
            at our option, return or destroy any copies of the materials you
            have made.
          </Typography>
          <Typography variant="termsOfUse">
            Our site changes regularly We aim to update our site regularly, and
            may change the content at any time. If the need arises, we may
            suspend access to our site, or close it indefinitely. Any of the
            material on our site may be out of date at any given time, and we
            are under no obligation to update such material. The material
            displayed on our site is provided without any guarantees, conditions
            or warranties as to its accuracy.
          </Typography>
          <Typography variant="termsOfUse">
            We are committed to respecting your privacy. Our Privacy Policy sets
            out the terms on which we process any personal data we collect from
            you, or that you provide to us. You must not misuse our site by
            knowingly introducing viruses, trojans, worms, logic bombs or other
            material which is malicious or technologically harmful. You must not
            attempt to gain unauthorised access to our site, the server on which
            our site is stored or any server, computer or database connected to
            our site. You must not attack our site via a denial-of-service
            attack or a distributed denial-of service attack.
          </Typography>
          <Typography variant="termsOfUse">
            You may link to our home page, provided you do so in a way that is
            fair and legal and does not damage our reputation or take advantage
            of it, but you must not establish a link in such a way as to suggest
            any form of association, approval or endorsement on our part where
            none exists. You must not establish a link from any website that is
            not owned by you unless this is in relation to a forum or blog site
            or other website where such linking is permitted. Our site must not
            be framed on any other site.
          </Typography>
          <Typography variant="termsOfUse">
            These terms of use shall be governed by international laws. If
            either party require to raise court proceedings in relation to any
            dispute relating to these terms or your use of our site then these
            proceedings must be raised in the UK or USA. We may revise these
            terms of use at any time by amending this page. You are expected to
            check this page from time to time to take notice of any changes we
            made, as they are binding on you.
          </Typography>
        </Stack>
      </MainWrapper>
    </>
  );
};
