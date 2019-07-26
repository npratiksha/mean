var imgUpload = angular.module('imageUpload',[])

imgUpload.directive('fileModel', ['$parse', function($parse){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				})
			})
		}
	}
}])

imgUpload.service('multipartForm', ['$http', function($http){
	this.post = function(uploadUrl, data){
		var fd = new FormData();
		for(var key in data)
			fd.append(key, data[key]);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
		});
	}
}])


imgUpload.controller('mainController', ['$scope', 'multipartForm', '$http', function($scope, multipartForm, $http){
    $scope.formData = {};
	$scope.value = [];

	$scope.addImages = function(){
		var imgFile  = $scope.formData;
		var ext = imgFile.file.name.match(/\.(.+)$/)[1];
        if(angular.lowercase(ext) ==='jpg' || angular.lowercase(ext) ==='jpeg' || angular.lowercase(ext) ==='png'){
			alert("Image Inserted");
			var uploadUrl = '/upload';
			multipartForm.post(uploadUrl, $scope.formData);
        }  
        else{
            alert("Invalid file format");
        }		
	}
	
	$scope.showData = function(){
		$http.get('/up')
		.then(function successCallback(response){
			$scope.value = response.data;
		},function errorCallback(response){
	
		})
	}

	$scope.delete = function(id,$index){
		if (confirm("Sure you want to delete!")) {
			$http.delete('/delete'+ id)
			.then(function successCallback(response){
				console.log(response.data);
				if(response.data.status == "Y"){
					$scope.value.splice($index,1);
					alert("Image Deleted");
				}
			},function errorCallback(response){
		
			})
		} else {
			
		}
	}
    
}]);