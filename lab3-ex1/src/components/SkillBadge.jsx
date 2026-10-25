
import styles from "./DeveloperCard.module.css";

export default function SkillBadge({ name, level }) {
  return (
    <li className={styles.skillBadge}>
      <span className={styles.skillName}>{name}</span>
      <span className={styles.skillLevel}>{level}</span>
    </li>
  );
}
