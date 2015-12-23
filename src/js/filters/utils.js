/**
 * Created by zhengguo.chen on 2015/12/10.
 */
//存放一些公用的filter
module.exports = myApp => {
  myApp.filter('eclipseId', () =>
    str => str.replace(/^(\w{10})(.*)(\w{4})$/, '$1...$3')
  );

  var getMissionTypeById = missionId =>  '1' + missionId.slice(2, 4);

  myApp.filter('filterByMissionType', () =>
    (data, type) => {
      if(!type) {
        return data;
      } else {
        return data.filter(item => getMissionTypeById(item.MISSION_ID) === type)
      }
    }
  );

  myApp.filter('getMissionTypeById', () => getMissionTypeById);
}
