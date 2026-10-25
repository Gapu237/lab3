
import { Fragment } from "react";
import styles from "./DeveloperCard.module.css";
import SkillBadge from "./SkillBadge.jsx";

export default function DeveloperCard({
  fullName = "Tran Vinh Khiem",
  role = "Senior Systems Architect • UIT S3T",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop",
  metrics = {
    Commits: 20,
    "Daily Score": 100,
    "Ally Score": 100,
  },
  skills = [
    { id: "react", name: "React 19 Fiber", level: "Core" },
    { id: "javascript", name: "JavaScript", level: "Advanced" },
    { id: "css", name: "CSS Modules", level: "Intermediate" },
  ],
}) {
  return (
    <article
      className={styles.card}
      aria-labelledby="dev-heading"
    >
      <header className={styles.header}>
        <img
          className={styles.avatar}
          src={avatarUrl}
          alt={`${fullName} avatar`}
          width={64}
          height={64}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        <hgroup className={styles.identity}>
          <h2 id="dev-heading">{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <section
        className={styles.metricsSection}
        aria-label="Developer metrics"
      >
        <h3>Performance Metrics</h3>

        <dl className={styles.metrics}>
          {Object.entries(metrics).map(([label, value]) => (
            <Fragment key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section
        className={styles.skillsSection}
        aria-labelledby="skills-heading"
      >
        <h3 id="skills-heading">Engineered Skills</h3>

        <ul className={styles.skills} aria-label="Engineered skills">
          {skills.map((skill) => (
            <SkillBadge
              key={skill.id}
              name={skill.name}
              level={skill.level}
            />
          ))}
        </ul>
      </section>
    </article>
  );
}
