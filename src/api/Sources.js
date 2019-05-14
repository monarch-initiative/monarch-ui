import axios from 'axios';
import yaml from 'js-yaml';

// this will be replaced when Deepak adds biolink route
export default async function getSources() {

  return {
    'sources':
     [

       {
         'id': 'OMIM',
         'url': 'http://omim.org',
         'title': 'Online Mendelian Inheritance in Man',
         'sourceDate': '2025-01-01'
       },

       {
         'id': 'PomBase',
         'url': 'http://pombase.org',
         'title': 'Pombe Model Organism Database',
         'sourceDate': '2025-01-01'
       }

     ]
  };

}
