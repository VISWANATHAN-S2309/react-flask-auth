const Home = () => {
  const homeStyles = {
    container: {
        padding: '50px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
    },
    heading: {
        color: '#333',
        fontSize: '36px',
        marginBottom: '20px'
    },
    welcomeText: {
        color: '#666',
        fontSize: '18px',
        lineHeight: '1.6'
    }
  };

  return (
    <>
      <div style={homeStyles.container}>
        <h1 style={homeStyles.heading}>Welcome to Our Application</h1>
        <p style={homeStyles.welcomeText}>
          You have successfully logged in! This is your home page.
        </p>
      </div>
    </>
  )
}

export default Home