import { useState } from 'react'
import './App.css'

const initialCertificate = {
  business: 'லயன்ஸ் கேபிள் நெட்ஒர்க்',
  address: 'Plot No. 4601, TNHB ஹவுசிங் போர்டு,\nவில்லாபுரம், மதுரை – 625 012.',
  title: 'வருமானம் மற்றும் பணி அனுபவச் சான்றிதழ்',
  employee: 'கணேஷ் பாபு',
  years: '15',
  role: 'கேபிள் லைன் சேவைப் பணி',
  salary: '20,000',
  salaryWords: 'இருபதாயிரம் ரூபாய் மட்டும்',
  place: 'மதுரை',
  date: '22/10/2026',
  owner: 'பார்த்தசாரதி',
}

const startCableCertificate = {
  ...initialCertificate,
  business: 'ஸ்டார்ட் கேபிள் நெட்ஒர்க்',
  salary: '15,000',
  salaryWords: 'பதினைந்தாயிரம் ரூபாய் மட்டும்',
}

const initialCertificates = {
  lions: initialCertificate,
  start: startCableCertificate,
}

const wordOverrides = {
  vanakkam: 'வணக்கம்',
  madurai: 'மதுரை',
  ganesh: 'கணேஷ்',
  babu: 'பாபு',
  thiru: 'திரு',
  thirumathi: 'திருமதி',
  nandri: 'நன்றி',
  peyar: 'பெயர்',
  velai: 'வேலை',
  sambalam: 'சம்பளம்',
  urimaiyalar: 'உரிமையாளர்',
  anubavam: 'அனுபவம்',
  varumanam: 'வருமானம்',
  sanrithal: 'சான்றிதழ்',
}

const consonants = {
  ng: 'ங்', nj: 'ஞ்', zh: 'ழ்', sh: 'ஷ்', ch: 'ச்', th: 'த்', dh: 'த்',
  k: 'க்', g: 'க்', c: 'ச்', j: 'ஜ்', t: 'ட்', d: 'ட்', n: 'ன்',
  p: 'ப்', b: 'ப்', m: 'ம்', y: 'ய்', r: 'ர்', l: 'ல்', v: 'வ்',
  w: 'வ்', s: 'ஸ்', h: 'ஹ்', f: 'ஃப்', q: 'க்', x: 'க்ஸ்',
}

const vowels = { a: 'அ', aa: 'ஆ', A: 'ஆ', i: 'இ', ii: 'ஈ', ee: 'ஈ', u: 'உ', uu: 'ஊ', oo: 'ஊ', e: 'எ', E: 'ஏ', ae: 'ஏ', ai: 'ஐ', o: 'ஒ', O: 'ஓ', au: 'ஔ' }
const vowelSigns = { a: '', aa: 'ா', A: 'ா', i: 'ி', ii: 'ீ', ee: 'ீ', u: 'ு', uu: 'ூ', oo: 'ூ', e: 'ெ', E: 'ே', ae: 'ே', ai: 'ை', o: 'ொ', O: 'ோ', au: 'ௌ' }
const tokenOrder = ['thirumathi', 'urimaiyalar', 'sambalam', 'varumanam', 'sanrithal', 'anubavam', 'vanakkam', 'madurai', 'ganesh', 'babu', 'thiru', 'nandri', 'pey ar'.replace(' ', ''), 'velai', 'ng', 'nj', 'zh', 'sh', 'ch', 'th', 'dh', 'aa', 'ii', 'ee', 'uu', 'oo', 'ae', 'ai', 'au', 'A', 'E', 'O', ...Object.keys(consonants).filter((key) => key.length === 1), 'a', 'i', 'u', 'e', 'o']

function transliterate(text) {
  return text.split(/(\s+)/).map((part) => {
    if (/^\s+$/.test(part)) return part
    const override = wordOverrides[part.toLowerCase()]
    if (override) return override

    let result = ''
    let index = 0
    while (index < part.length) {
      const token = tokenOrder.find((candidate) => part.slice(index, index + candidate.length).toLowerCase() === candidate.toLowerCase())
      if (!token) {
        result += part[index]
        index += 1
        continue
      }

      const lower = token.toLowerCase()
      if (consonants[lower]) {
        const base = consonants[lower].replace('்', '')
        index += token.length
        const nextToken = tokenOrder.find((candidate) => part.slice(index, index + candidate.length).toLowerCase() === candidate.toLowerCase() && vowels[candidate])
        if (nextToken) {
          result += base + vowelSigns[nextToken]
          index += nextToken.length
        } else if (part.slice(index, index + token.length).toLowerCase() === token.toLowerCase() && token.length === 1) {
          result += base + '்'
        } else {
          result += base + '்'
        }
      } else {
        result += vowels[lower] ?? token
        index += token.length
      }
    }
    return result
  }).join('')
}

const fields = [
  ['business', 'நிறுவனத்தின் பெயர்'],
  ['address', 'முகவரி'],
  ['title', 'சான்றிதழ் தலைப்பு'],
  ['employee', 'பணியாளர் பெயர்'],
  ['years', 'பணி அனுபவம் (ஆண்டுகள்)'],
  ['role', 'பணியின் தன்மை'],
  ['salary', 'மாதச் சம்பளம் (ரூ.)'],
  ['salaryWords', 'சம்பளம் (எழுத்தால்)'],
  ['place', 'இடம்'],
  ['date', 'தேதி'],
  ['owner', 'உரிமையாளர் பெயர்'],
]

function App() {
  const [activeTab, setActiveTab] = useState('lions')
  const [certificates, setCertificates] = useState(initialCertificates)
  const [tanglish, setTanglish] = useState(false)
  const [drafts, setDrafts] = useState({})
  const certificate = certificates[activeTab]

  function updateField(key, value) {
    const shouldTransliterate = tanglish && !['years', 'salary', 'date'].includes(key)
    if (shouldTransliterate) setDrafts((current) => ({ ...current, [key]: value }))
    setCertificates((current) => ({
      ...current,
      [activeTab]: { ...current[activeTab], [key]: shouldTransliterate ? transliterate(value) : value },
    }))
  }

  function toggleTanglish(enabled) {
    setDrafts({})
    setTanglish(enabled)
  }

  function selectTab(tab) {
    setDrafts({})
    setActiveTab(tab)
  }

  function resetCertificate() {
    setCertificates((current) => ({ ...current, [activeTab]: initialCertificates[activeTab] }))
    setDrafts({})
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Tamil certificate editor home"><span className="brand-mark">L</span><span>Letter Studio<small>TAMIL DOCUMENT EDITOR</small></span></a>
        <div className="top-actions">
          <label className="mode-switch"><input type="checkbox" checked={tanglish} onChange={(event) => toggleTanglish(event.target.checked)} /><span>Tanglish typing</span></label>
          <button className="print-button" onClick={() => window.print()} aria-label="Download selected certificate as PDF">↓ <span>Download PDF</span></button>
        </div>
      </header>

      <section className="editor-layout" id="top">
        <aside className="editor-panel">
          <div className="panel-heading"><div><p className="eyebrow">DOCUMENT BUILDER</p><h1>சான்றிதழ் திருத்தி</h1></div><button className="reset-button" onClick={resetCertificate}>மீட்டமை</button></div>
          <div className="certificate-tabs" role="tablist" aria-label="Certificate templates">
            <button type="button" role="tab" aria-selected={activeTab === 'lions'} className={activeTab === 'lions' ? 'certificate-tab active' : 'certificate-tab'} onClick={() => selectTab('lions')}>Lions Cable Network <small>₹20,000 / மாதம்</small></button>
            <button type="button" role="tab" aria-selected={activeTab === 'start'} className={activeTab === 'start' ? 'certificate-tab active' : 'certificate-tab'} onClick={() => selectTab('start')}>Start Cable Network <small>₹15,000 / மாதம்</small></button>
          </div>
          <p className="panel-intro">விவரங்களைத் திருத்துங்கள். வலப்புறத்தில் அச்சுப் பிரதியைப் பார்க்கலாம்.</p>
          {tanglish && <p className="tanglish-note">Tanglish-ஐ உள்ளிடுங்கள்; இடைவெளி கொடுத்ததும் தமிழாக மாறும். சிறப்புப் பெயர்களுக்கு முடிவுகளைச் சரிபார்க்கவும்.</p>}
          <div className="field-list">
            {fields.map(([key, label]) => (
              <label className={`field ${key === 'address' ? 'field-wide' : ''}`} key={key}>
                <span>{label}</span>
                {key === 'address' ? <textarea rows="2" value={tanglish ? drafts[key] ?? '' : certificate[key]} placeholder={tanglish ? certificate[key] : ''} onChange={(event) => updateField(key, event.target.value)} /> : <input value={tanglish && !['years', 'salary', 'date'].includes(key) ? drafts[key] ?? '' : certificate[key]} placeholder={tanglish && !['years', 'salary', 'date'].includes(key) ? certificate[key] : ''} onChange={(event) => updateField(key, event.target.value)} />}
              </label>
            ))}
          </div>
          <div className="editor-footer"><span className="status-dot" />உங்கள் மாற்றங்கள் நேரலையில் காட்டப்படும்</div>
        </aside>

        <section className="preview-panel" aria-label="Certificate preview">
          <div className="preview-toolbar"><div><span className="preview-label">முன்னோட்டம்</span><span className="paper-size">A4 · PORTRAIT</span></div><span className="preview-hint">அச்சிடும்போது A4 அளவைத் தேர்ந்தெடுக்கவும்</span></div>
          <article className="paper">
            <div className="paper-border">
              <div className="paper-header">
                <h2>{certificate.business}</h2>
                <p>{certificate.address.split('\n').map((line, index) => <span key={index}>{line}<br /></span>)}</p>
              </div>
              <div className="ornament"><span /><i>✦</i><span /></div>
              <h3>{certificate.title}</h3>
              <div className="certificate-copy">
                <p>இதன் மூலம், திரு. <strong>{certificate.employee}</strong> அவர்கள் எங்கள் <strong>{certificate.business}</strong> நிறுவனத்தில் கடந்த <strong>{certificate.years} ({numberWords(certificate.years)}) ஆண்டுகளாகப்</strong> பணிபுரிந்து வருகிறார் என்பதை உறுதிப்படுத்துகிறோம்.</p>
                <p>அவர் எங்கள் நிறுவனத்தில் <strong>{certificate.role}</strong> பணியில் ஈடுபட்டு வருகிறார். அவருக்கு மாதந்தோறும் ரூ. <strong>{certificate.salary}/-</strong> (எழுத்தால்: <strong>{certificate.salaryWords}</strong>) சம்பளமாக வழங்கப்பட்டு வருகிறது.</p>
                <p>அவர் எங்கள் நிறுவனத்தில் தொடர்ந்து பணியாற்றி வருவதையும், மேற்கண்ட சம்பளத் தொகையைப் பெற்று வருவதையும் இதன் மூலம் உறுதிப்படுத்துகிறோம்.</p>
                <p>இச்சான்றிதழ், அவருடைய பணி அனுபவம் மற்றும் மாத வருமான விவரங்களை ஆதாரமாகச் சமர்ப்பிப்பதற்காக வழங்கப்படுகிறது.</p>
              </div>
              <div className="paper-bottom"><div className="place-date"><p>இடம்: {certificate.place}</p><p>தேதி: {certificate.date}</p></div><div className="signature"><strong>நிறுவன உரிமையாளர்</strong><div className="signature-line" /><p>கையொப்பம்</p><strong>திரு. {certificate.owner}</strong><div className="stamp">நிறுவனத்தின்<br />முத்திரை</div></div></div>
              <div className="paper-footnote">{certificate.business} <span>•</span> {certificate.place}</div>
            </div>
          </article>
          <p className="privacy-note">இந்த ஆவணம் உங்கள் உலாவியில் மட்டுமே உருவாக்கப்படுகிறது.</p>
        </section>
      </section>
    </main>
  )
}

function numberWords(value) {
  const words = { '1': 'ஒன்று', '2': 'இரண்டு', '3': 'மூன்று', '4': 'நான்கு', '5': 'ஐந்து', '6': 'ஆறு', '7': 'ஏழு', '8': 'எட்டு', '9': 'ஒன்பது', '10': 'பத்து', '15': 'பதினைந்து', '20': 'இருபது', '25': 'இருபத்தைந்து', '30': 'முப்பது' }
  return words[value] ?? value
}

export default App
