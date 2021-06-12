const today = new Date()

exports.getDayNum = function(){
  return today.getDay()
}

exports.getDayName = function(){
  return today.toLocaleDateString('default', { weekday: 'long' });
}

exports.getMonthName = function(){
  return today.toLocaleDateString('default', { month: 'long' });
}
