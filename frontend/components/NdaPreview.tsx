import { NdaFormData } from "@/lib/types";

const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "___________";
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(day)} ${MONTHS_FR[parseInt(month) - 1]} ${year}`;
}

function blank(value: string, fallback = "___________"): string {
  return value.trim() || fallback;
}

interface Props {
  formData: NdaFormData;
  ref: React.Ref<HTMLDivElement>;
}

export default function NdaPreview({ formData, ref }: Props) {
  const {
    objet,
    dateEntreeEnVigueur,
    dureeNda,
    dureeNdaYears,
    dureeConfidentialite,
    dureeConfidentialiteYears,
    modifications,
    partie1,
    partie2,
  } = formData;

  return (
    <div
      ref={ref}
      className="bg-white font-serif text-sm leading-relaxed text-gray-900 p-12 max-w-3xl mx-auto"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* ── Cover Page ── */}
      <h1 className="text-2xl font-bold text-center mb-2">
        Accord de Confidentialité Mutuel
      </h1>

      <section className="mb-6">
        <h2 className="text-base font-bold mb-2 uppercase">
          Utilisation de cet accord de confidentialité mutuel
        </h2>
        <p className="mb-2">
          Le présent Accord de Confidentialité Mutuel (l&lsquo;« ACNM ») est composé de :
          (1) la présente Page de Couverture (« <strong>Page de Couverture</strong> ») et
          (2) les Conditions Générales de l&lsquo;ACNM Mutuel Common Paper Version 1.0
          (« <strong>Conditions Générales</strong> »). Toute modification des Conditions
          Générales doit être apportée sur la Page de Couverture, qui primera en cas de
          conflit avec les Conditions Générales.
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-bold mb-1">Objet</h3>
        <p className="italic text-xs text-gray-500 mb-1">
          Comment les Informations Confidentielles peuvent être utilisées
        </p>
        <p>{blank(objet)}</p>
      </section>

      <section className="mb-4">
        <h3 className="font-bold mb-1">Date d&lsquo;Entrée en Vigueur</h3>
        <p>{formatDate(dateEntreeEnVigueur)}</p>
      </section>

      <section className="mb-4">
        <h3 className="font-bold mb-1">Durée de l&lsquo;ACNM</h3>
        <p className="italic text-xs text-gray-500 mb-1">
          La durée du présent ACNM
        </p>
        <p>
          {dureeNda === "fixed" ? (
            <>
              &#x2611; Expire {dureeNdaYears} an{dureeNdaYears > 1 ? "s" : ""}{" "}
              à compter de la Date d&lsquo;Entrée en Vigueur.
              <br />
              &#x2610; Se poursuit jusqu&lsquo;à résiliation conformément aux conditions de l&lsquo;ACNM.
            </>
          ) : (
            <>
              &#x2610; Expire {dureeNdaYears} an{dureeNdaYears > 1 ? "s" : ""}{" "}
              à compter de la Date d&lsquo;Entrée en Vigueur.
              <br />
              &#x2611; Se poursuit jusqu&lsquo;à résiliation conformément aux conditions de l&lsquo;ACNM.
            </>
          )}
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-bold mb-1">Durée de Confidentialité</h3>
        <p className="italic text-xs text-gray-500 mb-1">
          Durée de protection des Informations Confidentielles
        </p>
        <p>
          {dureeConfidentialite === "fixed" ? (
            <>
              &#x2611; {dureeConfidentialiteYears} an
              {dureeConfidentialiteYears > 1 ? "s" : ""} à compter de la Date
              d&lsquo;Entrée en Vigueur, mais dans le cas des secrets d&lsquo;affaires, jusqu&lsquo;à
              ce que les Informations Confidentielles ne soient plus considérées comme un
              secret d&lsquo;affaires au sens du droit applicable (notamment la loi n° 2018-670
              du 30 juillet 2018 relative à la protection du secret des affaires).
              <br />
              &#x2610; À perpétuité.
            </>
          ) : (
            <>
              &#x2610; {dureeConfidentialiteYears} an
              {dureeConfidentialiteYears > 1 ? "s" : ""} à compter de la Date
              d&lsquo;Entrée en Vigueur.
              <br />
              &#x2611; À perpétuité.
            </>
          )}
        </p>
      </section>

      <section className="mb-4">
        <h3 className="font-bold mb-1">Droit Applicable et Juridiction</h3>
        <p>
          Droit applicable : droit français (Code civil)
          <br />
          Juridiction : tribunal compétent du lieu du siège social du défendeur en
          France (Tribunal de commerce ou Tribunal judiciaire selon la nature du litige)
        </p>
      </section>

      <section className="mb-6">
        <h3 className="font-bold mb-1">Modifications de l&lsquo;ACNM</h3>
        <p>{blank(modifications, "Aucune")}</p>
      </section>

      <p className="mb-4">
        En signant la présente Page de Couverture, chaque partie accepte de conclure le
        présent ACNM à compter de la Date d&lsquo;Entrée en Vigueur.
      </p>

      {/* Signature table */}
      <table className="w-full border-collapse text-sm mb-8">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2 text-left w-1/3"></th>
            <th className="border border-gray-400 p-2 text-center">PARTIE 1</th>
            <th className="border border-gray-400 p-2 text-center">PARTIE 2</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Signature", " ", " "],
            ["Nom en lettres capitales", blank(partie1.nom).toUpperCase(), blank(partie2.nom).toUpperCase()],
            ["Titre", blank(partie1.titre), blank(partie2.titre)],
            ["Société", blank(partie1.societe), blank(partie2.societe)],
            ["Adresse de notification", blank(partie1.adresse), blank(partie2.adresse)],
            ["Date", formatDate(partie1.date), formatDate(partie2.date)],
          ].map(([label, v1, v2]) => (
            <tr key={label}>
              <td className="border border-gray-400 p-2 font-medium">{label}</td>
              <td className="border border-gray-400 p-2 min-h-[2.5rem]">{v1}</td>
              <td className="border border-gray-400 p-2 min-h-[2.5rem]">{v2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-gray-500 mb-8">
        Accord de Confidentialité Mutuel Common Paper (Version 1.0) libre d&lsquo;utilisation
        sous CC BY 4.0. Adapté pour le droit français.
      </p>

      {/* ── General Conditions ── */}
      <hr className="border-gray-400 mb-6" />

      <h2 className="text-xl font-bold text-center mb-6">Conditions Générales</h2>

      <ol className="space-y-5 list-decimal list-outside pl-5">
        <li>
          <strong>Introduction.</strong> Le présent Accord de Confidentialité Mutuel
          (qui intègre ces Conditions Générales et la Page de Couverture) (« <strong>ACNM</strong> »)
          permet à chaque partie (« <strong>Partie Divulgatrice</strong> ») de divulguer ou de
          mettre à disposition des informations dans le cadre de l&lsquo;Objet, lesquelles
          (1) sont identifiées par la Partie Divulgatrice auprès de la partie réceptrice
          (« <strong>Partie Réceptrice</strong> ») comme « confidentielles », « propriétaires »
          ou similaires, ou (2) devraient raisonnablement être comprises comme
          confidentielles ou propriétaires au vu de leur nature et des circonstances de
          leur divulgation (« <strong>Informations Confidentielles</strong> »). Les
          Informations Confidentielles de chaque partie comprennent également l&lsquo;existence
          et l&lsquo;état des discussions entre les parties ainsi que les informations figurant
          sur la Page de Couverture. Les Informations Confidentielles incluent les
          informations techniques ou commerciales, les conceptions ou feuilles de route
          de produits, les exigences, les prix, la documentation relative à la sécurité
          et à la conformité, la technologie, les inventions et le savoir-faire. Pour
          utiliser cet ACNM, les parties doivent compléter et signer une page de
          couverture intégrant ces Conditions Générales (« <strong>Page de Couverture</strong> »).
          Chaque partie est identifiée sur la Page de Couverture et les termes en
          majuscules ont les significations données dans le présent accord ou sur la
          Page de Couverture.
        </li>

        <li>
          <strong>Utilisation et Protection des Informations Confidentielles.</strong>{" "}
          La Partie Réceptrice s&lsquo;engage à : (a) utiliser les Informations Confidentielles
          uniquement aux fins de l&lsquo;Objet ; (b) ne pas divulguer les Informations
          Confidentielles à des tiers sans l&lsquo;accord écrit préalable de la Partie
          Divulgatrice, sauf que la Partie Réceptrice peut divulguer les Informations
          Confidentielles à ses employés, agents, conseillers, sous-traitants et autres
          représentants ayant un besoin raisonnable d&lsquo;en connaître pour l&lsquo;Objet, à
          condition que ces représentants soient soumis à des obligations de
          confidentialité au moins aussi protectrices pour la Partie Divulgatrice que
          les dispositions applicables du présent ACNM et que la Partie Réceptrice
          demeure responsable de leur respect du présent ACNM ; et (c) protéger les
          Informations Confidentielles en utilisant au moins les mêmes mesures de
          protection que celles que la Partie Réceptrice utilise pour ses propres
          informations similaires, mais jamais moins qu&lsquo;un standard de précaution
          raisonnable.
        </li>

        <li>
          <strong>Exceptions.</strong> Les obligations de la Partie Réceptrice dans le
          présent ACNM ne s&lsquo;appliquent pas aux informations qu&lsquo;elle peut démontrer :
          (a) être ou devenir publiquement disponibles sans que ce soit de la faute de
          la Partie Réceptrice ; (b) avoir été légitimement connues ou possédées avant
          réception de la Partie Divulgatrice sans restriction de confidentialité ;
          (c) avoir été légitimement obtenues d&lsquo;un tiers sans restriction de
          confidentialité ; ou (d) avoir été développées de manière indépendante sans
          utiliser ni se référer aux Informations Confidentielles.
        </li>

        <li>
          <strong>Divulgations Requises par la Loi.</strong> La Partie Réceptrice peut
          divulguer les Informations Confidentielles dans la mesure requise par la loi,
          la réglementation ou une autorité réglementaire, une citation à comparaître
          ou une décision de justice, à condition (dans la mesure où la loi le permet)
          qu&lsquo;elle donne à la Partie Divulgatrice un préavis raisonnable de la divulgation
          requise et qu&lsquo;elle coopère raisonnablement, aux frais de la Partie Divulgatrice,
          aux efforts de la Partie Divulgatrice pour obtenir un traitement confidentiel
          des Informations Confidentielles.
        </li>

        <li>
          <strong>Durée et Résiliation.</strong> Le présent ACNM prend effet à la
          Date d&lsquo;Entrée en Vigueur et expire à la fin de la Durée de l&lsquo;ACNM. Chaque
          partie peut résilier le présent ACNM pour quelque raison que ce soit ou sans
          raison, sur notification écrite à l&lsquo;autre partie. Les obligations de la Partie
          Réceptrice relatives aux Informations Confidentielles survivront pendant la
          Durée de Confidentialité, nonobstant toute expiration ou résiliation du
          présent ACNM.
        </li>

        <li>
          <strong>Restitution ou Destruction des Informations Confidentielles.</strong>{" "}
          À l&lsquo;expiration ou à la résiliation du présent ACNM ou sur demande préalable
          de la Partie Divulgatrice, la Partie Réceptrice devra : (a) cesser d&lsquo;utiliser
          les Informations Confidentielles ; (b) promptement après la demande écrite de
          la Partie Divulgatrice, détruire toutes les Informations Confidentielles en sa
          possession ou sous son contrôle, ou les restituer à la Partie Divulgatrice ;
          et (c) si la Partie Divulgatrice le demande, confirmer par écrit le respect de
          ces obligations. Par dérogation au point (b), la Partie Réceptrice peut
          conserver les Informations Confidentielles conformément à sa politique standard
          de sauvegarde ou de conservation des archives ou si la loi l&lsquo;exige, mais les
          conditions du présent ACNM continueront de s&lsquo;appliquer aux Informations
          Confidentielles ainsi conservées.
        </li>

        <li>
          <strong>Droits de Propriété.</strong> La Partie Divulgatrice conserve tous
          ses droits de propriété intellectuelle et autres droits sur ses Informations
          Confidentielles, et leur divulgation à la Partie Réceptrice n&lsquo;accorde aucune
          licence sur ces droits.
        </li>

        <li>
          <strong>Exclusion de Garanties.</strong> TOUTES LES INFORMATIONS
          CONFIDENTIELLES SONT FOURNIES « EN L&lsquo;ÉTAT », AVEC TOUS DÉFAUTS, ET SANS
          GARANTIE, Y COMPRIS LES GARANTIES IMPLICITES DE TITRE, DE QUALITÉ MARCHANDE
          ET D&lsquo;ADÉQUATION À UN USAGE PARTICULIER.
        </li>

        <li>
          <strong>Droit Applicable et Juridiction.</strong> Le présent ACNM et toutes
          les questions s&lsquo;y rapportant sont régis par le droit français et interprétés
          conformément à celui-ci, sans égard aux règles de conflit de lois. Tout
          litige, action ou procédure juridique relatif au présent ACNM devra être
          porté devant les tribunaux français compétents, en particulier le Tribunal de
          commerce ou le Tribunal judiciaire compétent selon la nature du litige. Chaque
          partie se soumet irrévocablement à la juridiction exclusive de ces tribunaux.
        </li>

        <li>
          <strong>Mesures Conservatoires.</strong> La violation du présent ACNM peut
          causer un préjudice irréparable pour lequel les dommages et intérêts
          constituent un remède insuffisant. En cas de violation du présent ACNM, la
          Partie Divulgatrice est en droit de solliciter les mesures conservatoires ou
          injonctions appropriées auprès du juge des référés compétent, en plus de ses
          autres recours.
        </li>

        <li>
          <strong>Dispositions Générales.</strong> Aucune partie n&lsquo;a l&lsquo;obligation, au
          titre du présent ACNM, de divulguer des Informations Confidentielles à l&lsquo;autre
          partie ou de poursuivre toute transaction envisagée. Aucune partie ne peut
          céder le présent ACNM sans le consentement écrit préalable de l&lsquo;autre partie,
          sauf que chaque partie peut céder le présent ACNM dans le cadre d&lsquo;une fusion,
          d&lsquo;une réorganisation, d&lsquo;une acquisition ou de tout autre transfert de la
          totalité ou de la quasi-totalité de ses actifs ou titres votants. Toute cession
          effectuée en violation de la présente clause est nulle et non avenue. Le
          présent ACNM liera et profitera aux successeurs et ayants droit autorisés de
          chaque partie. Les renonciations doivent être signées par le représentant
          autorisé de la partie qui renonce et ne peuvent être déduites d&lsquo;un comportement.
          Si une disposition du présent ACNM est jugée inapplicable, elle sera limitée au
          minimum nécessaire pour que le reste de l&lsquo;ACNM demeure en vigueur. Le présent
          ACNM (y compris la Page de Couverture) constitue l&lsquo;intégralité de l&lsquo;accord des
          parties concernant son objet, et remplace toutes les compréhensions, accords,
          représentations et garanties antérieurs et contemporains, écrits ou oraux,
          concernant cet objet. Le présent ACNM ne peut être modifié, amendé, renoncé
          ou complété que par un accord écrit signé par les deux parties. Les
          notifications, demandes et approbations au titre du présent ACNM doivent être
          envoyées par écrit aux adresses e-mail ou postales figurant sur la Page de
          Couverture et sont réputées délivrées à réception. Le présent ACNM peut être
          signé en plusieurs exemplaires, y compris sous forme électronique, chacun
          étant considéré comme un original, et formant ensemble le même accord.
        </li>
      </ol>

      <p className="text-xs text-gray-500 mt-8">
        Accord de Confidentialité Mutuel Common Paper{" "}
        <a
          href="https://commonpaper.com/standards/mutual-nda/1.0/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Version 1.0
        </a>{" "}
        libre d&lsquo;utilisation sous CC BY 4.0. Adapté pour le droit français.
      </p>
    </div>
  );
}
