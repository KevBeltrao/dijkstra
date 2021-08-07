import './styles.css';

const Marker = ({ markedIndex }) => {
  return (
    <div className={`marker${markedIndex !== -1 ? ' marked' : ''}`}>
      {markedIndex !== -1 && markedIndex}
    </div>
  );
}
 
export default Marker;
