/*
* List of Companies we would be ** Moneytoring **
* isOn: true -> scheduled already
* schedule: 1 -> scheduled weekly - 'value' from schedules table below
*/
const comps = [
  {id: 0, isOn: false, schedule: 1, name: 'xoom'},
  {id: 1, isOn: false, schedule: 1, name: 'abc'},
  {id: 2, isOn: false, schedule: 1, name: 'xyz'}
];

/*
* Schedule details for each company above.
* adding 'value' (instead of 'id') for an easier look up in the
* Radio form later in HomeView
*/
const schedules = [
  {value: 0, label: ' '.repeat(4), id: 'daily'},
  {value: 1, label: ' '.repeat(4), id: 'weekly'},
  {value: 2, label: ' '.repeat(4), id: 'monthly'}
];

export { comps, schedules };
