(function() {
    'use strict';
    angular.module('internationalPhoneNumber', []).directive('internationalPhoneNumber', function($timeout) {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                defaultCountry: '@'
            },
            link: function(scope, element, attrs, ctrl) {
                var handleArrays, options, read, watchOnce;

                read = function() {
                    return ctrl.$setViewValue(element.intlTelInput('getNumber'));
                };
                handleArrays = function(value) {
                    if (value instanceof Array) {
                        return value;
                    } else {
                        return value.toString().replace(/[ ]/g, '').split(',');
                    }
                };
                options = {
                    allowExtensions: false,
                    autoFormat: true,
                    autoHideDialCode: true,
                    autoPlaceholder: true,
                    defaultCountry: '',
                    ipinfoToken: '',
                    nationalMode: true,
                    numberType: '',
                    onlyCountries: void 0,
                    preferredCountries: ['us', 'gb'],
                    utilsScript: ''
                };

                angular.forEach(options, function(value, key) {
                    var option;
                    if (!(attrs.hasOwnProperty(key) && angular.isDefined(attrs[key]))) {
                        return;
                    }
                    option = attrs[key];
                    if (key === 'preferredCountries') {
                        options.preferredCountries = handleArrays(option);
                        return true;
                    } else if (key === 'onlyCountries') {
                        options.onlyCountries = handleArrays(option);
                        return true;
                    } else if (typeof value === 'boolean') {
                        options[key] = option === 'true';
                        return true;
                    } else {
                        options[key] = option;
                        return true;
                    }
                });
                watchOnce = scope.$watch('ngModel', function(newValue) {
                    return scope.$$postDigest(function() {
                        options.defaultCountry = scope.defaultCountry;
                        if (newValue !== null && newValue !== void 0 && newValue !== '') {
                            element.val(newValue);
                        }
                        element.intlTelInput(options);

                        return watchOnce();
                    });
                });

                ctrl.$formatters.push(function(value) {
                    if (!value) {
                        return value;
                    } else {
                        $timeout(function() {
                          return element.intlTelInput('setNumber', value);
                        }, 0);
                        return element.val();
                    }
                });

                ctrl.$parsers.push(function(value) {
                    if (!value) {
                        return value;
                    }
                        return value.replace(/[^\d|+]/g, '');
                });
                ctrl.$parsers.push(function(value) {
                    var validity;
                    if (value) {
                        validity = element.intlTelInput('isValidNumber');
                    } else {
                        value = '';
                        validity = true;
                    }
                    ctrl.$setValidity('international-phone-number', validity);
                    ctrl.$setValidity('', validity);
                    return value;
                });

                element.on('blur keyup change', function() {
                    return scope.$apply(read);
                });
                return element.on('$destroy', function() {
                    return element.off('blur keyup change');
                });
            }
        };
    });
}).call(this);