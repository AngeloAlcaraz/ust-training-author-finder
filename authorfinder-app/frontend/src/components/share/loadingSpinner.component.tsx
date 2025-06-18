function LoadingSpinner() {

  return (<div className="d-flex justify-content-center">
    <div className="spinner-border text-primary " style={{ width: "4rem", height: "4rem" }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>);
}

export default LoadingSpinner;
// LoadingSpinner component for displaying a loading spinner