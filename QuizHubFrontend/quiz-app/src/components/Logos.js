function Logos(props) {
  return (
    <div>
      <img src={`/${props.logo}`} />
      <br></br>
      <p>{props.logo}</p>
    </div>
  );
}

export default Logos;
