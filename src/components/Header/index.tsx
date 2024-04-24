import './index.scss'
import styles from './index.module.scss'
import styled from 'styled-components'

const Button = styled.button`
  width: 100px;
  color: white;
  background: skyblue;
`

export function Header() {
  return (
    <>
      <p className="header">CSS 预处理器</p>
      <p className={styles.bheader}>CSS Modules</p>
      <Button>CSS In JS 之 styled-components</Button>
      <p className="bg-red-400">Tillwin css</p>
    </>
  )
}
