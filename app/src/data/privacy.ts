import type { PrivacyLink, PrivacyNotice } from '@/types/privacy'

/** Date of the current notice (ISO). Update together with both `updated` strings (EDU-45 D3). */
export const PRIVACY_LAST_UPDATED = '2026-11-04'

export const PRIVACY_PAGE_TITLE = 'Privacy notice · Datenschutzhinweis'

export const CONTROLLER = {
  name: 'Michael Schreiber',
  street: 'Grockelhofen 32',
  city: '89340 Leipheim',
  phone: '+49 (0) 162 4337334',
  phoneHref: 'tel:+491624337334',
  email: 'info@michaelschreiber.net',
} as const

export const PRIVACY_LINKS = {
  geminiTerms: 'https://ai.google.dev/gemini-api/terms',
  googlePrivacy: 'https://policies.google.com/privacy',
  firebasePrivacy: 'https://firebase.google.com/support/privacy',
  githubPrivacyEn:
    'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
  githubPrivacyDe:
    'https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement',
} as const

const emailLink: PrivacyLink = { label: CONTROLLER.email, href: `mailto:${CONTROLLER.email}` }
const phoneLink: PrivacyLink = { label: CONTROLLER.phone, href: CONTROLLER.phoneHref }

const english: PrivacyNotice = {
  lang: 'en',
  languageName: 'English',
  title: 'Privacy notice',
  updated: 'Last updated: 4 November 2026',
  intro:
    'Eulino is a learning app for children: they talk with Elly, an owl and AI learning buddy. This notice explains which data the Eulino app (for Android and for iPhone, iPad and Mac) and this website use, where the data go and how you can delete them. It is written for parents: “you” means the parent who sets up Eulino.',
  sections: [
    {
      id: 'in-short',
      title: 'In short',
      blocks: [
        {
          type: 'list',
          items: [
            'During a session, your child’s voice is streamed live to Google’s Gemini Live API. Google creates Elly’s answers and the transcripts from it. Eulino itself does not process or store any audio: it only sends the data to Google and has no control over what Google does with them.',
            'Eulino uses your own Gemini API key, so Google’s terms for your key apply. On the free tier, Google may use the data to improve its products; in the European Economic Area, Switzerland and the United Kingdom, the stricter rules of the paid tier apply.',
            'The session history, your API key and the settings stay on your device. The content of the sessions never reaches the developer of Eulino.',
            'The app sends crash reports to Firebase Crashlytics (Google) so that errors can be fixed. They contain no session content.',
            'No advertising, no analytics, no account. This website uses no cookies.',
          ],
        },
      ],
    },
    {
      id: 'controller',
      title: 'Who is responsible',
      blocks: [
        {
          type: 'paragraph',
          text: 'Responsible for Eulino and this website (controller under the GDPR):',
        },
        {
          type: 'address',
          lines: [CONTROLLER.name, CONTROLLER.street, CONTROLLER.city, 'Germany'],
        },
        { type: 'link', prefix: 'Phone:', link: phoneLink },
        { type: 'link', prefix: 'E-mail:', link: emailLink },
        {
          type: 'paragraph',
          text: 'For the data that Google processes under your own API key, Google’s terms and privacy policy apply as well (see “What Google does with your data”).',
        },
      ],
    },
    {
      id: 'gemini',
      title: 'Talking with Elly: Google’s Gemini Live API',
      blocks: [
        {
          type: 'paragraph',
          text: 'This is the core of Eulino. Elly’s voice, her answers and the text of the conversation come from Google’s Gemini Live API, not from Eulino.',
        },
        {
          type: 'list',
          items: [
            'The app uses the microphone only while a session is running. When the session is paused or ended, the microphone is off. You can withdraw the microphone permission at any time in the settings of your device.',
            'During a session, the app streams your child’s voice live to Google’s Gemini Live API. Google creates Elly’s spoken answers from it and a text version (transcript) of what your child and Elly say.',
            'Eulino itself does not process or store any audio: the app only sends it to Google and plays Elly’s answers.',
            'Together with the conversation, the app sends the instructions for the session and the titles of the last five sessions from the history, so that Elly can suggest new topics.',
            'So that an interrupted session can continue, Google keeps the state of the conversation for a limited time (session resumption).',
            'Eulino has no control over what Google does with these data. Google’s terms for your own API key apply (next section).',
          ],
        },
      ],
    },
    {
      id: 'google',
      title: 'What Google does with your data',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino only sends data to Google’s Gemini API. Because the app uses your own key, the requests run in your own Google Cloud project, and Google processes them under the Gemini API terms and Google’s privacy policy. According to the Gemini API terms:',
        },
        {
          type: 'list',
          items: [
            'Free tier (unpaid quota, no billing set up): Google uses the content sent and the answers to provide, improve and develop its products and technologies, and human reviewers may read and annotate them. Before that, Google disconnects the data from your Google account, API key and project. Google asks not to send sensitive, confidential or personal information to the free tier.',
            'Paid tier (billing set up): Google does not use the content to improve its products. It logs requests and answers for a limited period to detect and prevent abuse.',
            'In the European Economic Area, Switzerland and the United Kingdom, the paid-tier rules on how Google uses your data apply to the free tier as well.',
            'As with every internet connection, Google sees the IP address of your device. Google may process the data outside the EU, for example in the USA.',
          ],
        },
        { type: 'paragraph', text: 'Binding is Google’s own, current text:' },
        {
          type: 'link',
          prefix: 'Gemini API terms:',
          link: { label: PRIVACY_LINKS.geminiTerms, href: PRIVACY_LINKS.geminiTerms },
        },
        {
          type: 'link',
          prefix: 'Google privacy policy:',
          link: { label: PRIVACY_LINKS.googlePrivacy, href: PRIVACY_LINKS.googlePrivacy },
        },
      ],
    },
    {
      id: 'history',
      title: 'Session history and summaries',
      blocks: [
        {
          type: 'list',
          items: [
            'Once a session has moved past its first step, the app saves on your device: start time, duration, topic, language and, after the session, a title and up to 10 main points.',
            'To create the title and the points, the app keeps the text of the conversation (transcript) on your device for a short time and sends it once to the Gemini API (Google). Then the text is deleted – usually a few seconds after the session, at the latest after 7 days or 5 failed attempts.',
            'On iPhone, iPad and Mac, the transcript is never part of a backup. On Android, it can be part of a backup that happens to run during this short time.',
            'The history is shown only in the app. It contains no audio.',
          ],
        },
      ],
    },
    {
      id: 'pictures',
      title: 'Pictures',
      blocks: [
        {
          type: 'list',
          items: [
            'When Elly shows a picture, the app sends a short description written by Elly – only what the picture should show, no personal details – to an image model of the Gemini API (Google). Google creates the picture.',
            'Pictures are kept in memory only while they are shown. They are not saved and are not part of the history or of a backup.',
          ],
        },
      ],
    },
    {
      id: 'api-key',
      title: 'Your Gemini API key',
      blocks: [
        {
          type: 'list',
          items: [
            'You create the key yourself in Google AI Studio. It belongs to your Google account and your Google Cloud project. Eulino has no built-in key.',
            'The app stores the key encrypted and only on your device: on Android with the Android Keystore, on iPhone, iPad and Mac in the Keychain (only on this device, not synced with iCloud Keychain). The key is never part of a backup.',
            'The key is sent only to Google, with every request to the Gemini API. To check a new key, the app sends one request without any content.',
            'On iPhone, iPad and Mac, the key can stay in the Keychain of the device after the app is deleted. It stays on this device only and is replaced when you set up Eulino again. To make sure it can no longer be used, delete the key in Google AI Studio.',
          ],
        },
      ],
    },
    {
      id: 'crash-reports',
      title: 'Crash reports',
      blocks: [
        {
          type: 'paragraph',
          text: 'When the app crashes or stops responding, it sends a crash report to Firebase Crashlytics (Google), on Android as well as on iPhone, iPad and Mac. Only the published versions of the app do this, not development builds. The report contains the technical error description, device data (model, operating system version, free memory and storage, app version), a random installation ID and the times the app was started. It contains no session content, no history and no API key. Firebase keeps crash reports for 90 days.',
        },
        {
          type: 'paragraph',
          text: 'In addition, Google Play and Apple can share crash statistics with the developer if you allowed this in the settings of your device.',
        },
        {
          type: 'link',
          prefix: 'Firebase privacy:',
          link: { label: PRIVACY_LINKS.firebasePrivacy, href: PRIVACY_LINKS.firebasePrivacy },
        },
      ],
    },
    {
      id: 'device-and-backups',
      title: 'What stays on your device, and backups',
      blocks: [
        {
          type: 'list',
          items: [
            'On your device: the session history, the API key (encrypted), whether the introduction is finished, and the settings for the sessions.',
            'Android: only the session history can be part of your Android backup or of a transfer to a new device. A cloud backup is only made if Android can encrypt it end to end (screen lock set). The API key and the settings are never backed up.',
            'iPhone, iPad and Mac: the session history and the settings can be part of your iCloud backup, of a backup on your computer or with Time Machine, and of a transfer to a new device. The API key and transcripts waiting for their summary are never backed up.',
            'Eulino has no cloud sync of its own. If you export or share a lesson plan, the file goes only where you choose; it contains only the lesson steps.',
          ],
        },
      ],
    },
    {
      id: 'deleting',
      title: 'Deleting your data',
      blocks: [
        {
          type: 'list',
          items: [
            'The app has no delete button for the history yet.',
            'Android: Settings → Apps → Eulino → Storage → Clear storage (the names can differ on your device), or uninstall the app. This deletes the history, the API key and the settings.',
            'iPhone and iPad: delete the app. This deletes the history and the settings; the API key can stay in the Keychain (see “Your Gemini API key”).',
            'Mac: moving the app to the Trash does not delete its data. They stay in your user library under Library → Containers → Eulino; delete that folder as well.',
            'Backups: in the backup settings of your Google account (Android), of iCloud or of your computer (Apple). Older backups can still contain the history.',
            'Data at Google under your key: in Google AI Studio or your Google Cloud project. There you can also delete the key at any time. Google’s terms apply.',
            'Crash reports are deleted automatically after 90 days.',
          ],
        },
        { type: 'link', prefix: 'Questions:', link: emailLink },
      ],
    },
    {
      id: 'children',
      title: 'Children',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino is a learning app for children. A parent sets up Eulino with their own Google account and their own Gemini API key and uses it together with the child. The parent decides whether and how the child uses Eulino.',
        },
        {
          type: 'paragraph',
          text: 'Eulino asks for no name, no age and no other details about the child and has no child profile. What the child says during a session goes to Google as described above. Please make sure that your child does not share personal details in the conversation.',
        },
      ],
    },
    {
      id: 'website',
      title: 'This website',
      blocks: [
        {
          type: 'list',
          items: [
            'This website (www.eulino.app) is hosted on GitHub Pages, a service of GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA. When you open a page, GitHub processes technical access data in server log files, in particular your IP address, the date and time of access and information about your browser, to deliver the page and keep it secure.',
            'The website uses no cookies, no analytics, no tracking and no web fonts, loads nothing from other servers and has no forms.',
            'GitHub may process the data in the USA. GitHub participates in the EU-U.S. Data Privacy Framework.',
          ],
        },
        {
          type: 'link',
          prefix: 'GitHub privacy statement:',
          link: { label: PRIVACY_LINKS.githubPrivacyEn, href: PRIVACY_LINKS.githubPrivacyEn },
        },
      ],
    },
    {
      id: 'legal-bases',
      title: 'Legal bases',
      blocks: [
        {
          type: 'paragraph',
          text: 'The developer processes personal data on these legal bases of the GDPR (General Data Protection Regulation):',
        },
        {
          type: 'list',
          items: [
            'App functions you start yourself – the conversation with Elly, the session instructions and titles, session resumption, the summary, pictures, the key check, and the history and the key on your device: Art. 6(1)(b) GDPR (providing the app functions you use).',
            'Crash reports: Art. 6(1)(f) GDPR. The legitimate interest is a stable app without errors; the reports contain no session content.',
            'Server log files of this website: Art. 6(1)(f) GDPR. The legitimate interest is a reliable and secure delivery of the website.',
          ],
        },
        {
          type: 'paragraph',
          text: 'How Google processes the data it receives under your API key is governed by Google’s terms. Backups are made by Android or Apple according to the settings of your device.',
        },
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      blocks: [
        { type: 'paragraph', text: 'Under the GDPR you have the right to:' },
        {
          type: 'list',
          items: [
            'access the personal data stored about you (Art. 15),',
            'rectification (Art. 16) and erasure (Art. 17) of these data,',
            'restriction of processing (Art. 18),',
            'data portability (Art. 20),',
            'object at any time, on grounds relating to your particular situation, to processing based on Art. 6(1)(f) GDPR (Art. 21),',
            'lodge a complaint with a supervisory authority (Art. 77), for example the Bavarian Data Protection Authority (Bayerisches Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach, Germany).',
          ],
        },
        {
          type: 'paragraph',
          text: 'Most data never reach the developer: they are on your device, where you can delete them yourself, or at Google under your own key, where Google’s terms apply. For everything else, write to:',
        },
        { type: 'link', prefix: 'E-mail:', link: emailLink },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this notice',
      blocks: [
        {
          type: 'paragraph',
          text: 'When Eulino or this website changes how data are used, this notice is updated. The date at the top shows the current version. In the Android app, you find this notice under Settings → Privacy → Privacy notice.',
        },
      ],
    },
  ],
}

const german: PrivacyNotice = {
  lang: 'de',
  languageName: 'Deutsch',
  title: 'Datenschutzhinweis',
  updated: 'Stand: 4. November 2026',
  intro:
    'Eulino ist eine Lern-App für Kinder: Kinder sprechen darin mit Elly, einer Eule und KI-Lernbegleiterin. Dieser Hinweis erklärt, welche Daten die Eulino-App (für Android sowie für iPhone, iPad und Mac) und diese Website nutzen, wohin die Daten gehen und wie du sie löschen kannst. Er richtet sich an Eltern: „du“ ist das Elternteil, das Eulino einrichtet.',
  sections: [
    {
      id: 'in-short',
      title: 'Kurz gesagt',
      blocks: [
        {
          type: 'list',
          items: [
            'Während einer Session wird die Stimme deines Kindes live an die Gemini Live API von Google übertragen. Google erzeugt daraus Ellys Antworten und die Transkripte. Eulino selbst verarbeitet und speichert keine Audiodaten: Die App schickt die Daten nur an Google und hat keinen Einfluss darauf, was Google damit macht.',
            'Eulino nutzt deinen eigenen Gemini API-Key, deshalb gelten Googles Bedingungen für deinen Schlüssel. Im kostenlosen Kontingent darf Google die Daten nutzen, um seine Produkte zu verbessern; im Europäischen Wirtschaftsraum, in der Schweiz und im Vereinigten Königreich gelten die strengeren Regeln des bezahlten Kontingents.',
            'Der Verlauf, dein API-Key und die Einstellungen bleiben auf deinem Gerät. Die Inhalte der Sessions erreichen den Entwickler von Eulino nie.',
            'Die App sendet Absturzberichte an Firebase Crashlytics (Google), damit Fehler behoben werden können. Sie enthalten keine Inhalte der Sessions.',
            'Keine Werbung, keine Nutzungsanalyse, kein Konto. Diese Website verwendet keine Cookies.',
          ],
        },
      ],
    },
    {
      id: 'controller',
      title: 'Verantwortlich',
      blocks: [
        {
          type: 'paragraph',
          text: 'Verantwortlich für Eulino und diese Website (Verantwortlicher im Sinne der DSGVO):',
        },
        {
          type: 'address',
          lines: [CONTROLLER.name, CONTROLLER.street, CONTROLLER.city, 'Deutschland'],
        },
        { type: 'link', prefix: 'Telefon:', link: phoneLink },
        { type: 'link', prefix: 'E-Mail:', link: emailLink },
        {
          type: 'paragraph',
          text: 'Für die Daten, die Google mit deinem eigenen API-Key verarbeitet, gelten zusätzlich die Bedingungen und die Datenschutzerklärung von Google (siehe „Was Google mit deinen Daten macht“).',
        },
      ],
    },
    {
      id: 'gemini',
      title: 'Gespräche mit Elly: die Gemini Live API von Google',
      blocks: [
        {
          type: 'paragraph',
          text: 'Das ist der Kern von Eulino. Ellys Stimme, ihre Antworten und der Text des Gesprächs kommen von der Gemini Live API von Google, nicht von Eulino.',
        },
        {
          type: 'list',
          items: [
            'Die App nutzt das Mikrofon nur, solange eine Session läuft. Wenn die Session pausiert oder beendet ist, ist das Mikrofon aus. Die Mikrofon-Berechtigung kannst du jederzeit in den Einstellungen deines Geräts zurücknehmen.',
            'Während einer Session überträgt die App die Stimme deines Kindes live an die Gemini Live API von Google. Google erzeugt daraus Ellys gesprochene Antworten und eine Textfassung (Transkript) von dem, was dein Kind und Elly sagen.',
            'Eulino selbst verarbeitet und speichert keine Audiodaten: Die App schickt sie nur an Google und spielt Ellys Antworten ab.',
            'Mit dem Gespräch schickt die App die Anweisungen für die Session und die Titel der letzten fünf Sessions aus dem Verlauf, damit Elly neue Themen vorschlagen kann.',
            'Damit eine unterbrochene Session weitergehen kann, bewahrt Google den Stand des Gesprächs für eine begrenzte Zeit auf (Session-Fortsetzung).',
            'Eulino hat keinen Einfluss darauf, was Google mit diesen Daten macht. Es gelten Googles Bedingungen für deinen eigenen API-Key (nächster Abschnitt).',
          ],
        },
      ],
    },
    {
      id: 'google',
      title: 'Was Google mit deinen Daten macht',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino schickt Daten nur an die Gemini API von Google. Weil die App deinen eigenen Schlüssel nutzt, laufen die Anfragen in deinem eigenen Google-Cloud-Projekt, und Google verarbeitet sie nach den Gemini-API-Bedingungen und der Datenschutzerklärung von Google. Laut den Gemini-API-Bedingungen gilt:',
        },
        {
          type: 'list',
          items: [
            'Kostenloses Kontingent (keine Abrechnung eingerichtet): Google nutzt die gesendeten Inhalte und die Antworten, um seine Produkte und Technologien bereitzustellen, zu verbessern und weiterzuentwickeln, und Menschen dürfen sie zur Prüfung lesen und kommentieren. Vorher trennt Google die Daten von deinem Google-Konto, API-Key und Projekt. Google bittet, im kostenlosen Kontingent keine sensiblen, vertraulichen oder persönlichen Angaben zu senden.',
            'Bezahltes Kontingent (Abrechnung eingerichtet): Google nutzt die Inhalte nicht, um seine Produkte zu verbessern. Anfragen und Antworten werden für eine begrenzte Zeit protokolliert, um Missbrauch zu erkennen und zu verhindern.',
            'Im Europäischen Wirtschaftsraum, in der Schweiz und im Vereinigten Königreich gelten die Regeln des bezahlten Kontingents zur Nutzung deiner Daten auch im kostenlosen Kontingent.',
            'Wie bei jeder Internetverbindung sieht Google die IP-Adresse deines Geräts. Google kann die Daten auch außerhalb der EU verarbeiten, zum Beispiel in den USA.',
          ],
        },
        { type: 'paragraph', text: 'Verbindlich ist Googles eigener, aktueller Text:' },
        {
          type: 'link',
          prefix: 'Gemini-API-Bedingungen:',
          link: { label: PRIVACY_LINKS.geminiTerms, href: PRIVACY_LINKS.geminiTerms },
        },
        {
          type: 'link',
          prefix: 'Datenschutzerklärung von Google:',
          link: { label: PRIVACY_LINKS.googlePrivacy, href: PRIVACY_LINKS.googlePrivacy },
        },
      ],
    },
    {
      id: 'history',
      title: 'Verlauf und Zusammenfassungen',
      blocks: [
        {
          type: 'list',
          items: [
            'Sobald eine Session über ihren ersten Schritt hinaus ist, speichert die App auf deinem Gerät: Startzeit, Dauer, Thema, Sprache und nach der Session einen Titel und bis zu 10 wichtige Punkte.',
            'Für Titel und Punkte bewahrt die App den Text des Gesprächs (Transkript) kurz auf deinem Gerät auf und schickt ihn einmal an die Gemini API (Google). Danach wird der Text gelöscht – meist wenige Sekunden nach der Session, spätestens nach 7 Tagen oder 5 fehlgeschlagenen Versuchen.',
            'Auf iPhone, iPad und Mac ist das Transkript nie Teil eines Backups. Unter Android kann es Teil eines Backups sein, das zufällig in dieser kurzen Zeit läuft.',
            'Der Verlauf wird nur in der App angezeigt. Er enthält keine Audiodaten.',
          ],
        },
      ],
    },
    {
      id: 'pictures',
      title: 'Bilder',
      blocks: [
        {
          type: 'list',
          items: [
            'Wenn Elly ein Bild zeigt, schickt die App eine kurze Beschreibung, die Elly schreibt – nur, was das Bild zeigen soll, keine persönlichen Angaben –, an ein Bildmodell der Gemini API (Google). Google erzeugt das Bild.',
            'Bilder liegen nur im Arbeitsspeicher, solange sie zu sehen sind. Sie werden nicht gespeichert und sind weder Teil des Verlaufs noch eines Backups.',
          ],
        },
      ],
    },
    {
      id: 'api-key',
      title: 'Dein Gemini API-Key',
      blocks: [
        {
          type: 'list',
          items: [
            'Den Schlüssel erstellst du selbst in Google AI Studio. Er gehört zu deinem Google-Konto und deinem Google-Cloud-Projekt. Eulino hat keinen eingebauten Schlüssel.',
            'Die App speichert den Schlüssel verschlüsselt und nur auf deinem Gerät: unter Android mit dem Android Keystore, auf iPhone, iPad und Mac im Schlüsselbund (nur auf diesem Gerät, nicht mit dem iCloud-Schlüsselbund synchronisiert). Der Schlüssel ist nie Teil eines Backups.',
            'Der Schlüssel geht nur an Google, mit jeder Anfrage an die Gemini API. Um einen neuen Schlüssel zu prüfen, schickt die App eine Anfrage ohne Inhalte.',
            'Auf iPhone, iPad und Mac kann der Schlüssel nach dem Löschen der App im Schlüsselbund des Geräts bleiben. Er bleibt nur auf diesem Gerät und wird ersetzt, wenn du Eulino wieder einrichtest. Damit er sicher nicht mehr genutzt werden kann, lösche den Schlüssel in Google AI Studio.',
          ],
        },
      ],
    },
    {
      id: 'crash-reports',
      title: 'Absturzberichte',
      blocks: [
        {
          type: 'paragraph',
          text: 'Wenn die App abstürzt oder nicht mehr reagiert, sendet sie einen Absturzbericht an Firebase Crashlytics (Google), unter Android ebenso wie auf iPhone, iPad und Mac. Das tun nur die veröffentlichten Versionen der App, keine Entwicklungsversionen. Der Bericht enthält die technische Fehlerbeschreibung, Gerätedaten (Modell, Version des Betriebssystems, freier Arbeitsspeicher und Speicherplatz, App-Version), eine zufällige Installations-ID und die Zeitpunkte, zu denen die App gestartet wurde. Er enthält keine Inhalte der Sessions, keinen Verlauf und keinen API-Key. Firebase bewahrt Absturzberichte 90 Tage auf.',
        },
        {
          type: 'paragraph',
          text: 'Außerdem können Google Play und Apple dem Entwickler Absturzstatistiken bereitstellen, wenn du das in den Einstellungen deines Geräts erlaubt hast.',
        },
        {
          type: 'link',
          prefix: 'Datenschutz bei Firebase:',
          link: { label: PRIVACY_LINKS.firebasePrivacy, href: PRIVACY_LINKS.firebasePrivacy },
        },
      ],
    },
    {
      id: 'device-and-backups',
      title: 'Was auf deinem Gerät bleibt, und Backups',
      blocks: [
        {
          type: 'list',
          items: [
            'Auf deinem Gerät: der Verlauf, der API-Key (verschlüsselt), ob die Einführung abgeschlossen ist, und die Einstellungen für die Sessions.',
            'Android: Nur der Verlauf kann Teil deines Android-Backups oder einer Übertragung auf ein neues Gerät sein. Ein Cloud-Backup gibt es nur, wenn Android es Ende-zu-Ende verschlüsseln kann (Displaysperre eingerichtet). Der API-Key und die Einstellungen werden nie gesichert.',
            'iPhone, iPad und Mac: Der Verlauf und die Einstellungen können Teil deines iCloud-Backups, eines Backups auf deinem Computer oder mit Time Machine und einer Übertragung auf ein neues Gerät sein. Der API-Key und Transkripte, die noch auf ihre Zusammenfassung warten, werden nie gesichert.',
            'Eulino hat keine eigene Cloud-Synchronisierung. Wenn du einen Lernplan exportierst oder teilst, geht die Datei nur dorthin, wo du es auswählst; sie enthält nur die Schritte des Lernplans.',
          ],
        },
      ],
    },
    {
      id: 'deleting',
      title: 'Deine Daten löschen',
      blocks: [
        {
          type: 'list',
          items: [
            'In der App gibt es noch keine Möglichkeit, den Verlauf zu löschen.',
            'Android: Einstellungen → Apps → Eulino → Speicher → Speicher löschen (die Namen können auf deinem Gerät anders sein), oder die App deinstallieren. Damit werden der Verlauf, der API-Key und die Einstellungen gelöscht.',
            'iPhone und iPad: die App löschen. Damit werden der Verlauf und die Einstellungen gelöscht; der API-Key kann im Schlüsselbund bleiben (siehe „Dein Gemini API-Key“).',
            'Mac: Wenn du die App in den Papierkorb legst, werden ihre Daten nicht gelöscht. Sie bleiben in deiner Benutzer-Library unter Library → Containers → Eulino; lösche auch diesen Ordner.',
            'Backups: in den Backup-Einstellungen deines Google-Kontos (Android), von iCloud oder deines Computers (Apple). Ältere Backups können den Verlauf noch enthalten.',
            'Daten bei Google zu deinem Schlüssel: in Google AI Studio oder deinem Google-Cloud-Projekt. Dort kannst du den Schlüssel auch jederzeit löschen. Es gelten Googles Bedingungen.',
            'Absturzberichte werden nach 90 Tagen automatisch gelöscht.',
          ],
        },
        { type: 'link', prefix: 'Fragen:', link: emailLink },
      ],
    },
    {
      id: 'children',
      title: 'Kinder',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eulino ist eine Lern-App für Kinder. Ein Elternteil richtet Eulino mit dem eigenen Google-Konto und dem eigenen Gemini API-Key ein und nutzt es gemeinsam mit dem Kind. Die Eltern entscheiden, ob und wie das Kind Eulino nutzt.',
        },
        {
          type: 'paragraph',
          text: 'Eulino fragt keinen Namen, kein Alter und keine anderen Angaben zum Kind ab und hat kein Kinderprofil. Was das Kind während einer Session sagt, geht wie oben beschrieben an Google. Achte bitte darauf, dass dein Kind im Gespräch keine persönlichen Angaben macht.',
        },
      ],
    },
    {
      id: 'website',
      title: 'Diese Website',
      blocks: [
        {
          type: 'list',
          items: [
            'Diese Website (www.eulino.app) wird bei GitHub Pages gehostet, einem Dienst der GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA. Wenn du eine Seite aufrufst, verarbeitet GitHub technische Zugriffsdaten in Server-Logdateien, insbesondere deine IP-Adresse, Datum und Uhrzeit des Zugriffs und Angaben zu deinem Browser, um die Seite auszuliefern und sicher zu betreiben.',
            'Die Website verwendet keine Cookies, keine Analyse, kein Tracking und keine Web-Fonts, lädt nichts von anderen Servern und hat keine Formulare.',
            'GitHub kann die Daten in den USA verarbeiten. GitHub nimmt am EU-U.S. Data Privacy Framework teil.',
          ],
        },
        {
          type: 'link',
          prefix: 'Datenschutzerklärung von GitHub:',
          link: { label: PRIVACY_LINKS.githubPrivacyDe, href: PRIVACY_LINKS.githubPrivacyDe },
        },
      ],
    },
    {
      id: 'legal-bases',
      title: 'Rechtsgrundlagen',
      blocks: [
        {
          type: 'paragraph',
          text: 'Der Entwickler verarbeitet personenbezogene Daten auf diesen Rechtsgrundlagen der DSGVO (Datenschutz-Grundverordnung):',
        },
        {
          type: 'list',
          items: [
            'App-Funktionen, die du selbst startest – das Gespräch mit Elly, die Anweisungen und Titel für die Session, die Session-Fortsetzung, die Zusammenfassung, Bilder, die Prüfung des Schlüssels sowie der Verlauf und der Schlüssel auf deinem Gerät: Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der App-Funktionen, die du nutzt).',
            'Absturzberichte: Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist eine stabile App ohne Fehler; die Berichte enthalten keine Inhalte der Sessions.',
            'Server-Logdateien dieser Website: Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ist eine zuverlässige und sichere Auslieferung der Website.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Wie Google die Daten verarbeitet, die es mit deinem API-Key erhält, regeln Googles Bedingungen. Backups erstellen Android oder Apple nach den Einstellungen deines Geräts.',
        },
      ],
    },
    {
      id: 'rights',
      title: 'Deine Rechte',
      blocks: [
        { type: 'paragraph', text: 'Nach der DSGVO hast du das Recht auf:' },
        {
          type: 'list',
          items: [
            'Auskunft über die zu dir gespeicherten personenbezogenen Daten (Art. 15),',
            'Berichtigung (Art. 16) und Löschung (Art. 17) dieser Daten,',
            'Einschränkung der Verarbeitung (Art. 18),',
            'Datenübertragbarkeit (Art. 20),',
            'Widerspruch jederzeit, aus Gründen, die sich aus deiner besonderen Situation ergeben, gegen eine Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21),',
            'Beschwerde bei einer Aufsichtsbehörde (Art. 77), zum Beispiel beim Bayerischen Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Die meisten Daten erreichen den Entwickler nie: Sie liegen auf deinem Gerät, wo du sie selbst löschen kannst, oder bei Google zu deinem eigenen Schlüssel, wo Googles Bedingungen gelten. Für alles andere schreib an:',
        },
        { type: 'link', prefix: 'E-Mail:', link: emailLink },
      ],
    },
    {
      id: 'changes',
      title: 'Änderungen dieses Hinweises',
      blocks: [
        {
          type: 'paragraph',
          text: 'Wenn sich ändert, wie Eulino oder diese Website Daten nutzen, wird dieser Hinweis angepasst. Das Datum oben zeigt den aktuellen Stand. In der Android-App findest du diesen Hinweis unter Einstellungen → Datenschutz → Datenschutzhinweis.',
        },
      ],
    },
  ],
}

export const privacyNotices: readonly PrivacyNotice[] = [english, german]
