import axios from "axios";

export default async function getNewsItems() {
  const monarchRss =
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@monarchinit";
  let newsItems = [];

  try {
    const newsResponse = await axios.get(monarchRss);
    newsItems = newsResponse.data.items.map((elem) => ({
      url: elem.link,
      // https://stackoverflow.com/q/4310953
      date: new Date(elem.pubDate.replace(/-/g, "/")).toDateString().slice(4),
      title: elem.title,
    }));
  } catch (e) {
    // console.log('ERROR fetching and parsing medium RSS', e);
  }
  return newsItems;
}
