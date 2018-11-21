import axios from 'axios';
import yaml from 'js-yaml';

export default async function getNewsItems() {
  const newsUrl = `${process.env.BASE_URL}news.yaml`;
  const newsResponse = await axios.get(newsUrl);

  let newsItems = [];
  try {
    const newsParsed = yaml.safeLoad(newsResponse.data, 'utf8');
    newsItems = newsParsed.news.items;
  }
  catch (e) {
    console.log('getNewsItems yaml.safeLoad ERROR', e);
  }

  return newsItems;
}
