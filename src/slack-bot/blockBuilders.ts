const question = (question: string, questionId: string) => ({
  "type": "input",
  "block_id": "question_block",
  "element": {
    "type": "plain_text_input",
    "multiline": true,
    "action_id": questionId
  },
  "label": {
    "type": "plain_text",
    "text": question,
    "emoji": true
  }
})

const submitQuestionButton = () => ({
  "type": "actions",
  "elements": [
    {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "Submit",
        "emoji": true
      },
      "value": "click_me_123",
      "action_id": "submit_question"
    }
  ]
})

export const blocks = {
  question,
  submitQuestionButton
}
