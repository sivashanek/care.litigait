export default () => ({
  Sections: require('./inputs/SectionsInput').default,
  Object: require('./ObjectInput').default,
  List: require('./ListInput').default,
  Text: require('./inputs/TextInput').default,
  DateOfBirth: require('./inputs/DateOfBirthInput').default,
  BodyMassIndex: require('./inputs/BodyMassIndexInput').default,
  YesNo: require('./inputs/YesNoInput').default,
  LongText: require('./inputs/TextInput').default,
  OneOf: require('./inputs/OneOfInput').default,
  Checkboxes: require('./inputs/CheckboxesInput').default,
});
