import React from 'react';
import styles from './styles.module.scss';
import { TCard } from '@/src/types/types';


const Card = ({ title, description, cardStyles }: TCard) => {
  return (
    <div className={styles.card} style={cardStyles}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export default Card