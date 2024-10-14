import '@styles/globals.scss';
import { LeftWrapper } from '@components/mainItem';
import KakaoMap from '@components/kakaoMap';
/* eslint-disable */

function App() {
  return (
    <div className="container">
      <LeftWrapper />
      <KakaoMap />
    </div>
  );
}

export default App;
