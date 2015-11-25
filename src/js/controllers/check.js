/**
 * Created by zhengguo.chen on 2015/11/22.
 */
var CONST = require('../constant');

module.exports = myApp => {
  myApp.controller('checkController', ['$scope', '$rootScope', "$timeout", "$state", '$filter', 'apiService',
    function($scope, $rootScope, $timeout, $state, $filter, apiService) {
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
          $scope.tmp.selectAll = false;
        });
      }
      getMissions();

      //翻页
      $scope.getPageMissions = offset => {
        $scope.state.pageIndex += offset;
        getMissions();
      }

      var getDataList = (missionId, autoClickFirst) => apiService.getRefDataByMission({
        MISSION_ID: missionId
      }).success(data => {
        if(data.success === CONST.API_SUCCESS) {
          $scope.data.dataList = data.rows;
          if(autoClickFirst && data.rows.length) {
            $scope.onShowDataClick(data.rows[0].DATA_ID, data.rows[0].DATA_TYPE);
          }
        } else {
          $scope.data.dataList = [];
        }
      });

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
              getMissions();
              $scope.state.currentTask && getDataList($scope.state.currentTask);
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
                getMissions();
                $scope.state.currentTask && getDataList($scope.state.currentTask);
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
            $scope.data.checkParam = {};
            $scope.state.workState = STATES.VIEW_DATA;
            $scope.state.workStateSuper = STATES.CHECK_DATA;
            $scope.state.currentData = dataId;
            $scope.state.currentDataType = type;
            $scope.state.workTemplate = 'create-data-' + type + '.html';

            $scope.data.dataParam = data.Data;
            $scope.tmp._img = getDataImg();
            $scope.tmp.region = {
              name: data.Data.COUNTY_NAME,
              code: data.Data.COUNTY_CODE
            };
            $scope.tmp.grassBType = {
              TYPE_NAME: data.Data.GRASS_BG_TYPE,
              TYPE_ID: data.Data.GRASS_BG_TYPE_ID
            };
            $scope.tmp.grassSType = {
              TYPE_NAME: data.Data.GRASS_SM_TYPE,
              TYPE_ID: data.Data.GRASS_SM_TYPE_ID
            };

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

      var getDataImg = type => {
        var DATA_TAG = '00';
        if('3,6,7,8'.indexOf(type) !== -1) {
          DATA_TAG = '01';
        }
        return CONF.baseUrl + '/util/ShowPhoto.action?' +
          $.param({
            MISSION_ID: $scope.state.currentTask,
            DATA_ID: $scope.state.currentData,
            DATA_TAG: DATA_TAG,
            TIMES: (new Date().getTime())
          })
      };

      $scope.onCancelCreateDataClick = () => {
        $scope.state.currentData = null;
      };

      //获取下一条ID和TYPE，并展示，返回是否成功
      var showNextData = () => {
        var findNext = false;
        var allChecked = true;
        $scope.data.dataList.forEach((item, index) => {
          if(item.DATA_ID == $scope.state.currentData) {
            var nextItem = $scope.data.dataList[index+1];
            if(!findNext && nextItem) {
              $scope.state.currentData = nextItem.DATA_ID;
              $scope.state.currentDataType = nextItem.DATA_TYPE;
              findNext = true;
            }
            console.log(item.DATA_ID,$scope.state.currentData,$rootScope.data.user.userRole, item.CHECK_STU);
          } else {
            if(
              ($rootScope.data.user.userRole == '4' && item.CHECK_STU === '待市审核') ||
              ($rootScope.data.user.userRole == '3' && item.CHECK_STU === '市通过，待省审核')
            ) {
              allChecked = false;
            }
          }
        });

        console.log(allChecked);

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
                getMissions();
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
            showNextData();
            getDataList($scope.state.currentTask);
            //获取下一条数据
            $scope.tmp._checkIsOpen = false;
          }
        })
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
