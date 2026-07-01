import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { DigitalTwinChat } from "@/components/DigitalTwinChat";
import {
  expertise,
  journey,
  metrics,
  portfolioLinks,
  projectCards,
  skillGroups,
} from "@/lib/careerProfile";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.pageShell}>
      <div className={styles.backgroundMesh} aria-hidden="true" />
      <div className={styles.gridGlow} aria-hidden="true" />

      <header className={styles.topbar}>
        <a href="#hero" className={styles.wordmark}>
          <span className={styles.wordmarkAccent}>IK</span>
          <span>Ilona Kuznetsova</span>
        </a>

        <nav className={styles.nav}>
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#digital-twin">Twin</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="hero" className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>
            <Sparkles size={16} />
            <span>Data Scientist | Applied Mathematics | AI Systems</span>
          </div>

          <div className={styles.expertiseRail}>
            {expertise.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <h1>
            Enterprise-ready thinking.
            <br />
            Sharp, modern machine intelligence.
          </h1>

          <p className={styles.heroLead}>
            I build rigorous ML systems with a bias toward measurable outcomes,
            clean execution, and product-minded research. My focus spans computer
            vision, NLP, and data science with an analytical foundation in
            applied mathematics.
          </p>

          <div className={styles.heroActions}>
            <a className={styles.primaryCta} href="mailto:ilonakuz@proton.me">
              <Mail size={18} />
              <span>Start a conversation</span>
            </a>
            <a className={styles.secondaryCta} href="#digital-twin">
              <span>Talk to my digital twin</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div>
                <p className={styles.profileLabel}>Current Focus</p>
                <h2>ML that performs under real constraints</h2>
              </div>
              <span className={styles.statusPill}>Available</span>
            </div>

            <div className={styles.profileList}>
              <div>
                <MapPin size={16} />
                <span>Kyiv, Ukraine</span>
              </div>
              <div>
                <GraduationCap size={16} />
                <span>BSc Applied Mathematics, 2025</span>
              </div>
              <div>
                <BriefcaseBusiness size={16} />
                <span>Computer Vision, NLP, Data Science</span>
              </div>
              <div>
                <Phone size={16} />
                <span>+380 (68) 393 8534</span>
              </div>
            </div>

            <div className={styles.profileQuote}>
              <span className={styles.quoteLine} />
              <p>
                I care about turning strong analysis into systems that are
                useful, understandable, and built to improve.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.metrics}>
        {metrics.map((metric) => (
          <article key={metric.label} className={styles.metricCard}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section id="about" className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p>About Me</p>
          <h2>Analytical by training, ambitious by default.</h2>
        </div>

        <div className={styles.aboutGrid}>
          <div className={styles.aboutCopy}>
            <p>
              I am a data scientist with a strong grounding in applied
              mathematics and a clear interest in building intelligent systems
              that stand up to practical evaluation. I enjoy projects where
              experimentation, engineering discipline, and domain context all
              matter at once.
            </p>
            <p>
              My recent work has centered on computer vision, especially
              classification and segmentation problems where model architecture
              is only part of the answer. I pay close attention to data
              imbalance, pipeline design, interpretability, and the small
              technical decisions that compound into better results.
            </p>
          </div>

          <div className={styles.valueStack}>
            <article>
              <h3>Research with direction</h3>
              <p>
                I like exploratory work best when it is tied to a clear
                decision, a benchmark, or a business question.
              </p>
            </article>
            <article>
              <h3>Execution with taste</h3>
              <p>
                Strong systems should feel thoughtful in both code and
                presentation. Precision matters.
              </p>
            </article>
            <article>
              <h3>Growth mindset, technical backbone</h3>
              <p>
                I am building toward bigger AI challenges with a foundation in
                math, modeling, and disciplined implementation.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="journey" className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p>Career Journey</p>
          <h2>From academic rigor to high-impact technical work.</h2>
        </div>

        <div className={styles.timeline}>
          {journey.map((item) => (
            <article key={item.title} className={styles.timelineItem}>
              <div className={styles.timelineMeta}>
                <span>{item.period}</span>
              </div>
              <div className={styles.timelineBody}>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <p className={styles.outcome}>{item.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p>Project Lens</p>
          <h2>Selected work themes that define how I build.</h2>
        </div>

        <div className={styles.projectGrid}>
          {projectCards.map(({ icon: Icon, eyebrow, title, description }) => (
            <article key={title} className={styles.projectCard}>
              <div className={styles.projectIcon}>
                <Icon size={20} />
              </div>
              <span>{eyebrow}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p>Capabilities</p>
          <h2>Tools and methods I reach for with intent.</h2>
        </div>

        <div className={styles.skillsGrid}>
          {skillGroups.map(({ icon: Icon, title, items }) => (
            <article key={title} className={styles.skillCard}>
              <div className={styles.skillTitle}>
                <Icon size={18} />
                <h3>{title}</h3>
              </div>
              <div className={styles.skillTags}>
                {items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="digital-twin" className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p>AI Layer</p>
          <h2>A portfolio that can answer back.</h2>
        </div>

        <DigitalTwinChat />
      </section>

      <section id="portfolio-links" className={styles.sectionBlock}>
        <div className={styles.sectionHeading}>
          <p>Portfolio Links</p>
          <h2>Structured now for future expansion.</h2>
        </div>

        <div className={styles.linkGrid}>
          {portfolioLinks.map((link) => (
            <a key={link.title} href={link.href} className={styles.linkCard}>
              <div className={styles.linkTopline}>
                <h3>{link.title}</h3>
                <span>{link.status}</span>
              </div>
              <p>{link.description}</p>
              <div className={styles.linkAction}>
                <span>Explore section</span>
                <ArrowUpRight size={18} />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.contactBand}>
        <div className={styles.contactCopy}>
          <p>Contact</p>
          <h2>Open to ambitious teams, meaningful ML work, and sharp problems.</h2>
          <span>
            English: full working proficiency. Ukrainian and Russian: bilingual.
          </span>
        </div>

        <div className={styles.contactActions}>
          <a href="mailto:ilonakuz@proton.me">
            <Mail size={18} />
            <span>ilonakuz@proton.me</span>
          </a>
          <a href="tel:+380683938534">
            <Phone size={18} />
            <span>+380 (68) 393 8534</span>
          </a>
        </div>
      </section>
    </main>
  );
}
