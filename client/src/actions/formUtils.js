export function share({
  email,
  history,
  messageContext,
  sessionContext,
  feedbackItem1,
  feedbackItem2,
  feedbackItem3
}) {
  messageContext.clearMessages();
  return fetch("/api/feedback/initiate", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionContext.token}`
    },
    body: JSON.stringify({
      receiver: email,
      feedbackItems: [feedbackItem1, feedbackItem2, feedbackItem3]
    })
  }).then(response => {
    if (response.ok) {
      return response.json().then(json => {
        messageContext.setSuccessMessages([json]);
        history.replace("/mydashboard");
      });
    } else {
      return response.json().then(json => {
        const messages = Array.isArray(json) ? json : [json];
        messageContext.setErrorMessages(messages);
      });
    }
  });
}

export function getTemplateLabels() {
  return [
    "You are doing great at...",
    "You could work on/improve...",
    "Suggestions..."
  ];
}
