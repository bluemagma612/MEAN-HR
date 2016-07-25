var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
 name: 
 {
      type: String,
      required: true
  }, 
  description: 
  {
      type: String,
      required: true
  }, 
  team_id: 
  {
    type: Schema.Types.ObjectId,
    ref: 'Team_id'
  }, 
  employee_id: 
  {
    type: Schema.Types.ObjectId,
    ref: 'Employee_id'
  }, 
  date: 
  {
    type: Date
  }
});

module.exports = mongoose.model('Event', EventSchema);