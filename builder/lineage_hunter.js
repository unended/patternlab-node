/* 
 * patternlab-node - v0.10.0 - 2015 
 * 
 * Brian Muenzenmeyer, and the web community.
 * Licensed under the MIT license. 
 * 
 * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice. 
 *
 */

(function () {
	"use strict";

	var lineage_hunter = function(){

		var pa = require('./pattern_assembler');
		var pattern_assembler = new pa();

		function findlineage(pattern, patternlab){

			//find the {{> template-name }} within patterns
			var matches = pattern_assembler.find_pattern_partials(pattern);
			if(matches !== null){
				matches.forEach(function(match, index, matches){
					//strip out the template cruft
					var foundPattern = match.replace("{{> ", "").replace(" }}", "").replace("{{>", "").replace("}}", "");

					//add if it doesnt exist
					if (pattern.lineageIndex.indexOf(foundPattern) === -1){

						pattern.lineageIndex.push(foundPattern);

						patternlab.patterns.forEach(function(ancestorPattern, index, patterns){

							//find the pattern in question
							var searchPattern = ancestorPattern.patternGroup + "-" + ancestorPattern.patternName;

							if(searchPattern === foundPattern){
								//create the more complex patternLineage object too
								var l = {
									"lineagePattern": foundPattern,
									"lineagePath": "../../patterns/" + ancestorPattern.patternLink
								};
								pattern.lineage.push(JSON.stringify(l));

								//also, add the lineageR entry if it doesn't exist
								var patternLabel = pattern.patternGroup + "-" + pattern.patternName;
								if (ancestorPattern.lineageRIndex.indexOf(patternLabel) === -1){
									ancestorPattern.lineageRIndex.push(patternLabel);

									//create the more complex patternLineage object in reverse
									var lr = {
										"lineagePattern": patternLabel,
										"lineagePath": "../../patterns/" + pattern.patternLink
									};
									ancestorPattern.lineageR.push(JSON.stringify(lr));
								}
							}

						});

					}
				});
			}
		}

		return {
			find_lineage: function(pattern, patternlab){
				findlineage(pattern, patternlab);
			}
		};

	};

	module.exports = lineage_hunter;

}());
