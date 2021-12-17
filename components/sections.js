import { Stack } from '@chakra-ui/react';

function Sections() {
  
  const merchHandler = () => {}
  const utilityHandler = () => {}
  const virtualHandler = () => {}
  const mysteryHandler = () => {}

  const merchButton = () => {
    return (
      <button 
        onClick={merchHandler} 
        className='cta-button-two merch-button'>
          Merch
      </button>
    )
  }

  const utilityButton = () => {
    return (
      <button 
        onClick={utilityHandler} 
        className='cta-button-two one-button'>
          Utility
      </button>
    )
  }

  const virtualButton = () => {
    return (
      <button 
        onClick={virtualHandler} 
        className='cta-button-two two-button'>
          Virtual
      </button>
    )
  }

  const mysteryButton = () => {
    return (
      <button 
        onClick={mysteryHandler} 
        className='cta-button-two three-button'>
          ?
      </button>
    )
  }

  return (
    <div className='main-app'>
      <div>
        <Stack spacing={4} direction='row' align='center'>
          {merchButton()}
          {utilityButton()}
          {virtualButton()}
          {mysteryButton()}
        </Stack>
      </div>
    </div>
  )
}

export default (Sections);