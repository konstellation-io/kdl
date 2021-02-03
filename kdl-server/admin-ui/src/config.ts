const isDev = process.env.NODE_ENV === 'development';
const configUrl = isDev ? '/config/config.json.tpl' : '/config/config.json';

const config = fetch(configUrl).then((response) => {
  if (!response.ok) {
    throw new Error(
      `Unexpected status code: ${response.status} getting configuration file`
    );
  }
  return response.json();
});

export default config;
