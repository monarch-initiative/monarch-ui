import axios from 'axios';
import yaml from 'js-yaml';

export default async function getTeam() {
  const teamUrl = `${process.env.BASE_URL}team.yaml`;
  console.log('getTeam', teamUrl);
  const teamResponse = await axios.get(teamUrl);
  console.log('teamResponse', teamResponse);

  let team = null;
  try {
    const teamParsed = await yaml.safeLoad(teamResponse.data, 'utf8');
    const institutions = teamParsed.institutions;
    console.log('teamParsed', teamParsed, institutions);

    institutions.forEach((i) => {
      i.logo = `${process.env.BASE_URL}${i.logo}`;

      const people = i.people;
      const peopleNames = people
        .filter(p => !p.alumni)
        .map(p => p.name);
      i.peopleNames = peopleNames;
      people.forEach((p) => {
        p.picture = `${process.env.BASE_URL}${p.picture}`;
      });
    });
    team = teamParsed;
  }
  catch (e) {
    console.log('getTeam yaml.safeLoad ERROR', e);
  }

  return team;
}
