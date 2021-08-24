import axios from "axios";
import yaml from "js-yaml";

export async function getTeam() {
  const teamUrl = `${process.env.BASE_URL}team.yaml`;
  const teamResponse = await axios.get(teamUrl);

  let team = null;
  try {
    const teamParsed = await yaml.safeLoad(teamResponse.data, "utf8");
    const institutions = teamParsed.institutions;

    institutions.forEach((i) => {
      i.logo = `${process.env.BASE_URL}${i.logo}`;

      const people = i.people;
      const peopleNames = people.filter((p) => !p.alumni).map((p) => p.name);
      i.peopleNames = peopleNames;
      people.forEach((p) => {
        p.picture = `${process.env.BASE_URL}${p.picture}`;
      });
    });
    team = teamParsed;
  } catch (e) {
    // console.log('getTeam yaml.safeLoad ERROR', e);
  }

  return team;
}

export async function getRecentlyCurated() {
  const recentlyCuratedUrl = `${process.env.BASE_URL}mondo_ids.txt`;
  const curatedResponse = await axios.get(recentlyCuratedUrl);
  try {
    const curatedLines = [];
    const todayDate = new Date();
    const thisMonth = todayDate.getMonth();
    curatedResponse.data.split("\n").forEach((line) => {
      const pieces = line.split("\t");
      const mondo = pieces[0];
      const date = pieces[1];
      const itemDate = new Date(date).getUTCMonth();
      if (itemDate === thisMonth) {
        line = {};
        line.mondo = mondo;
        line.date = Date.parse(date);
        curatedLines.push(line);
      }
    });
    return curatedLines;
  } catch (e) {
    return [];
  }
}
