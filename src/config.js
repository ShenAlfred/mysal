/**
 * Created by admin on 2017/6/9.
 */

const config = {
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://10.52.30.155' : 'http://10.52.30.155',                  //生产环境待确认
  isDevEnv: process.env.NODE_ENV === 'development' ? true : false
};

export default config
