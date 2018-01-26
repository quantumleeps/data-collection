import * as mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
    name: String,
    units: String
})

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    points: [pointSchema]
})

const locationSchema = new mongoose.Schema({
  name: String,
  country: String,
  groups: [groupSchema],
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
