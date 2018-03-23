angular.module('roveretoPercorsi.filters', [])

.filter('ellipsis', function ($rootScope) {
    return function (input, limit) {
        if (!input) {
            return '';
        } else {
            if (input.length < limit) {
                return input;
            } else if (limit < 4) {
                return input.substring(0, limit);
            } else {
                return input.substring(0, limit - 3) + '...';
            }
        }
    };
})

.filter('cleanMenuID', function ($filter) {
        return function (input) {
            if (!input) return '';
            if (input.indexOf('csvimport_') == 0) {
                return input.replace(/[^_]+_([^_]+)_.*/gi, '$1').toLowerCase().replace(/\s+/gi, '_');
            } else {
                return input;
            }
        }
    })
    .filter('externalLinks', function () {
        return function (text) {
            return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
        }
    })
    .filter('setDecimal', function ($filter) {
        return function (input, places) {
            if (isNaN(input)) return input;
            // If we want 1 decimal place, we want to mult/div by 10
            // If we want 2 decimal places, we want to mult/div by 100, etc
            // So use the following to create that factor
            var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
            return Math.round(input * factor) / factor;
        };
    })
    .filter('addrclean', function ($filter) {
        return function (input) {
            addr = $filter('translate')(input);
            if (!addr) {
                return '';
            } else {
                addr = addr.replace(/38\d\d\d/i, '');
                return addr;
            }
        }
    })
    .filter('translate_remote', function ($rootScope, Config) {
        return function (input, debug) {
            lang = FORCED_LANGUAGE ? FORCED_LANGUAGE : $rootScope.lang;
            if (debug) console.log('translate: lang=' + lang);
            if (!input) {
                return '';
            } else {
                if (debug) console.log('input.0: ' + input);
                if (debug) console.log('input var type: ' + typeof input);
                if (typeof input == 'string') input = Config.keys()[input] || input;
                if (input[lang] && input[lang] != '') {
                    if (debug) console.log('input.1: ' + JSON.stringify(input));
                    return input[lang];
                } else {
                    if (debug) console.log('input it: ' + (input.it || 'FALSY'));
                    if (debug) console.log('input.2: ' + JSON.stringify(input));
                    if (input.hasOwnProperty('en') && input['en']) {
                        return input.en || '';
                    } else if (input.hasOwnProperty('it') && input['it']) {
                        return input.it || '';
                    } else {
                        return (typeof input == 'string' ? input : '') || '';
                    }
                }
            }
        };
    })

.filter('translate_plur', function ($filter) {
    return function (input, count) {
        if (typeof count == 'object') {
            var countAll = 0;
            for (g in count) {
                //console.log('count[g].results.length: '+ (count[g].results?count[g].results.length:'NULL'));
                if (count[g].results) countAll += count[g].results.length;
            }
            count = countAll;
        }
        if (typeof input == 'string' && typeof count == 'number') {
            if (count == 0) {
                return $filter('translate')(input + '_none');
            } else if (count == 1) {
                return $filter('translate')(input + '_single');
            } else {
                return count + ' ' + $filter('translate')(input + '_plural');
            }
        } else {
            return $filter('translate')(input);
        }
    };
})

.filter('extOrderBy', function ($rootScope) {
    return $rootScope.extOrderBySorter;
})

.filter("nl2br", function ($filter) {
    return function (data) {
        if (!data) return data;
        return data.replace(/\n\r?/g, '<br />');
    };
})
