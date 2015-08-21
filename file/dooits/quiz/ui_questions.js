/*
{
 dependencies:[
  ['dooits/quiz/ui_questions.js',true],
  ['css/quiz/ui_questions.css',true],
  ['dooits/quiz/ui_question_sample_schema.js',true]
 ],
 dooit:'ui_questions'
}
*/

var ui_questions = {
	start: function() {
		this.containers.arena = $(yoodoo.e("div"));
		$(this.containers.container).empty().append(this.containers.arena);
		yoodoo.ui.drawSchema(this,this.schema,this.containers.arena);
	},
	displayed: function() {
		yoodoo.ui.update();
	}
};