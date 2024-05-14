import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'AKUAVISION'}
      subTitle={translate('Water Quality Management Using Ai & Computer Vision')}
      extra={
        <>
          <p>
            GitHub :{' '}
            <a href="https://github.com/Ashar88/Project-AkuaVision">
              https://github.com/Ashar88/Project-AkuaVision
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://github.com/Ashar88/Project-AkuaVision`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
