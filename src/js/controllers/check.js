/**
 * Created by zhengguo.chen on 2015/11/22.
 */
var CONST = require('../constant');

module.exports = myApp => {
  myApp.controller('checkController', ['$scope', '$rootScope', '$timeout', '$q', '$state', '$filter', 'apiService',
    function($scope, $rootScope, $timeout, $q, $state, $filter, apiService) {
      const STATES = {
        'VIEW_DATA_LIST': 1,
        'VIEW_DATA': 2,
        'CHECK_DATA': 9
      };

      $scope.tmp = {};
      $scope.data = {};
      $scope.STATES = STATES;

      $scope.state = {
        createTaskFull: false,
        workState: STATES.VIEW_DATA_LIST,
        currentTask: null,
        currentTaskName: '',
        currentData: null,
        pageIndex: 0,
        isLastPage: 0
      };

      var getMissions = () => {
        var deferred = $q.defer();
        $scope.state.isLastPage = false;
        var postData = {
          PAGEINDEX: $scope.state.pageIndex,
          PAGECOUNT: CONST.PAGE_SIZE
        }
        apiService.getAllUnCheMission(postData).success(data => {
          if(data.success === CONST.API_SUCCESS) {
            $scope.data.missions = data.rows;
            if(data.rows.length === 0) {
              $scope.state.isLastPage = true;
            }
          } else {
            $scope.data.missions = [];
            $scope.state.isLastPage = true;
          }
          deferred.resolve();
          $scope.tmp.selectAll = false;
        });
        return deferred.promise;
      }
      getMissions();

      var refreshMissions = () => {
        getMissions().then(() => {
          if(!$scope.data.missions.some(item => {
            if($scope.state.currentTask == item.MISSION_ID) {
              getDataList($scope.state.currentTask);
              return true;
            }
          })) {
            $scope.state.currentTask = null;
            $scope.state.currentTaskName = null;
            $scope.state.currentData = null;
            $scope.state.workState = STATES.VIEW_DATA_LIST;
            $scope.data.dataList = [];
          }
        });
      }

      //翻页
      $scope.getPageMissions = offset => {
        $scope.state.pageIndex += offset;
        refreshMissions();
      }

      var getDataList = (missionId, autoClickFirst) => {
        var deferred = $q.defer();
        apiService.getRefDataByMission({
          MISSION_ID: missionId
        }).success(data => {
          if(data.success === CONST.API_SUCCESS) {
            deferred.resolve();
            $scope.data.dataList = data.rows;
            if(autoClickFirst && data.rows.length) {
              $scope.onShowDataClick(data.rows[0].DATA_ID, data.rows[0].DATA_TYPE);
            }
          } else {
            $scope.data.dataList = [];
          }
        });
        return deferred.promise;
      }

      $scope.onSubmitTaskClick = (missionId, missionName) => {
        $rootScope.showTips({
          type: 'confirm',
          msg:
          '任务名称：' + missionName +
          '<br/>任务编号：' + missionId +
          '<br/>确定提交该任务？'
        }).then(() => {
          apiService.checkMission(
            {MISSION_ID: missionId}
          ).success(res => {
            if(res.success === CONST.API_SUCCESS) {
              refreshMissions();
            }
          })
        });
      };

      //批量提交
      $scope.onSubmitOnceClick = () => {
        var submitMissionIds = [];
        $scope.data.missions.forEach(item => item._select && submitMissionIds.push(item.MISSION_ID));
        if(!submitMissionIds.length) {
          $rootScope.showTips({
            type: 'error',
            msg: '请至少选择一条审核任务。'
          });
        } else {
          var postData = {MISSION_IDS: submitMissionIds.join(',')};
          $rootScope.showTips({
            type: 'confirm',
            msg: '确定要提交所勾选的 ' + submitMissionIds.length + ' 条审核任务？'
          }).then(function() {
            apiService.checkMissionOnce(postData).success(res => {
              if(res.success === CONST.API_SUCCESS) {
                $rootScope.showTips({msg: '提交审核任务成功'});
                refreshMissions();
              }
            });
          });
        }
      }

      $scope.onShowDataListClick = (missionId, missionName) => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
        $scope.state.currentTask = missionId;
        $scope.state.currentTaskName = missionName;
        getDataList(missionId, true);
      };

      $scope.cancelCreateTask = () => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
      };


      $scope.onShowTaskClick = () => {
        $scope.state.workState = STATES.VIEW_DATA_LIST;
        $scope.state.currentData = null;
      };

      $scope.onCreateDataClick = type => {
        //子类非工程样方需要设置SAMPLE_PLOT_ID，标识父级
        $scope.data.dataParam = {SAMPLE_PLOT_ID: $scope.data.dataParam ? $scope.data.dataParam.SAMPLE_PLOT_ID : undefined};
        $scope.state.workState = STATES.CREATE_DATA;
        $scope.state.workTemplate = 'create-data-' + type + '.html';
      };

      $scope.onShowDataClick = (dataId, type) => {
        apiService.getDataDetail({
          DATA_ID: dataId,
          DATA_TYPE: type
        }).success(data => {
          if(data.success === CONST.API_SUCCESS) {
            $scope.data.dataParam = {};
            $scope.data.checkParam = {
              CHECK_TAG: '1'
            };
            $scope.state.workState = STATES.VIEW_DATA;
            $scope.state.workStateSuper = STATES.CHECK_DATA;
            $scope.state.currentData = dataId;
            $scope.state.currentDataType = type;
            $scope.state.workTemplate = 'create-data-' + type + '.html';

            $scope.data.dataParam = data.Data;
            $scope.tmp._img = $rootScope.getDataImg($scope.state.currentTask, $scope.state.currentData, '00');
            $scope.tmp._img1 = $rootScope.getDataImg($scope.state.currentTask, $scope.state.currentData, '01');
            $scope.tmp._img2 = $rootScope.getDataImg($scope.state.currentTask, $scope.state.currentData, '02');
            
            $scope.tmp.region = data.Data.COUNTY_CODE ? {
              code: data.Data.COUNTY_CODE,
              name: data.Data.COUNTY_NAME
            } : '';

            $scope.tmp.grassBType = data.Data.GRASS_BG_TYPE ? {
              TYPE_NAME: data.Data.GRASS_BG_TYPE,
              TYPE_ID: data.Data.GRASS_BG_TYPE_ID
            } : '';
            $scope.tmp.grassSType = data.Data.GRASS_SM_TYPE ? {
              TYPE_NAME: data.Data.GRASS_SM_TYPE,
              TYPE_ID: data.Data.GRASS_SM_TYPE_ID
            } : '';
            $scope.tmp.grassBType1 = data.Data.I_GRASS_BG_TYPE ? {
              TYPE_NAME: data.Data.I_GRASS_BG_TYPE,
              TYPE_ID: data.Data.I_GRASS_BG_TYPE_ID
            } : '';
            $scope.tmp.grassSType1 = data.Data.I_GRASS_SM_TYPE ? {
              TYPE_NAME: data.Data.I_GRASS_SM_TYPE,
              TYPE_ID: data.Data.I_GRASS_SM_TYPE_ID
            } : '';
            $scope.tmp.grassBType2 = data.Data.O_GRASS_BG_TYPE ? {
              TYPE_NAME: data.Data.O_GRASS_BG_TYPE,
              TYPE_ID: data.Data.O_GRASS_BG_TYPE_ID
            } : '';
            $scope.tmp.grassSType2 = data.Data.O_GRASS_SM_TYPE ? {
              TYPE_NAME: data.Data.O_GRASS_SM_TYPE,
              TYPE_ID: data.Data.O_GRASS_SM_TYPE_ID
            } : '';


            //获取子列表
            //$scope.getSubDataList();
          }
        })
      };

      $scope.onCancelDataClick = () => {
        if($scope.state.currentDataType == '7' || $scope.state.currentDataType == '6') {
          $scope.state.currentDataType = '3';
        }
        if($scope.state.currentDataType == '5' || $scope.state.currentDataType == '4') {
          $scope.state.currentDataType = '2';
        }
        $scope.showCurrentData();
      };

      $scope.showCurrentData = () => {
        if($scope.state.currentData && $scope.state.currentDataType) {
          $scope.onShowDataClick($scope.state.currentData, $scope.state.currentDataType);
        } else {
          getDataList($scope.state.currentTask);
          $scope.state.workTemplate = 'none.html';
        }
      }

      $scope.getSubDataList = () => {
        apiService.queryFqudBySmpId(res => {
          var data = res.data;
          if(data.success === CONST.API_SUCCESS) {
            //$rootScope.
          }
        })
      };

      $scope.onCancelCreateDataClick = () => {
        $scope.state.currentData = null;
      };

      //获取下一条ID和TYPE，并展示，返回是否成功
      var showNextData = () => {
        var findNext = false;
        var allChecked = true;
        var currentDataId = $scope.state.currentData;
        $scope.data.dataList.forEach((item, index) => {
          if(item.DATA_ID == currentDataId) {
            var nextItem = $scope.data.dataList[index+1];
            if(!findNext && nextItem) {
              $scope.state.currentData = nextItem.DATA_ID;
              $scope.state.currentDataType = nextItem.DATA_TYPE;
              findNext = true;
            }
          }

          if(($rootScope.data.user.userRole == '4' && item.CHECK_STU === '待市审核') ||
            ($rootScope.data.user.userRole == '3' && item.CHECK_STU === '市通过，待省审核')
          ) {
            allChecked = false;
          }
        });

        if(allChecked) {
          $rootScope.showTips({
            type: 'confirm',
            msg: '该任务的所有数据都已完成审核，是否提交该任务？'
          }).then(() => {
            apiService.checkMission(
              {MISSION_ID: $scope.state.currentTask}
            ).success(res => {
              if(res.success === CONST.API_SUCCESS) {
                $scope.onShowTaskClick();
                refreshMissions();
              }
            })
          }, () => {
            $scope.showCurrentData();
          });
        } else {
          $scope.showCurrentData();
        }
      };

      //审核部分的事件
      $scope.onSubmitCheckClick = () => {
        var postData = {
          DATA_ID: $scope.state.currentData,
          CHECK_TAG: $scope.data.checkParam.CHECK_TAG,
          CHECK_MSG: $scope.data.checkParam.CHECK_TAG == '2' ? $scope.data.checkParam.CHECK_MSG : "",
          CHECK_MAN: $rootScope.data.user.userRealName
        };
        apiService.checkDataOption(postData).success(res => {
          if(res.success === CONST.API_SUCCESS) {
            getDataList($scope.state.currentTask).then(() => {
              //获取下一条数据
              $timeout(showNextData, 500);
            });
            $scope.tmp._checkIsOpen = false;
          }
        });
      };
      $scope.onCancelCheckClick = () => {
        $scope.tmp._checkIsOpen = false;
      }

      //全选监听
      $scope.onSelectAllChanged = selected => {
        if($scope.data.missions) {
          $scope.data.missions.forEach(item => item._select = selected);
        }
      };
      $scope.onSelectChanged = selected => {
        var selectAll = false;
        if(selected && undefined == $scope.data.missions.find(item => {
            return !item._select;
          })) {
          selectAll = true;
        }
        $scope.tmp.selectAll = selectAll;
      };

    }
  ]);

}
