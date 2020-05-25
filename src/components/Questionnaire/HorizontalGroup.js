import styled from 'styled-components'

export default styled.div`
  display: flex;
  
  margin-left: -0.5em;
  margin-right: -0.5em;
  
  > div {
    margin-left: 0.5em;
    margin-right: 0.5em;
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
`
