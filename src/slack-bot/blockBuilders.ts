const question = (question: string, questionId: number) => ({
  "type": "input",
  "block_id": "question_block",
  "element": {
    "type": "plain_text_input",
    "multiline": true,
    "action_id": String(questionId)
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

const comparisonInsights = (comparisons: string[]) =>
    comparisons.map((comparison) => ({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": comparison
      }
    }))


export const blocks = {
  question,
  submitQuestionButton,
  comparisonInsights
}
