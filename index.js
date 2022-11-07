const ModalField = {
    QUESTION: 'question',
    ANSWER: 'answer',
    VALUE: 'value',
    CATEGORY: 'category',
};

const API_URL = 'http://jservice.io/api/random?count=';

const CategoryValues = ['Music', 'Geography', 'History', 'Famous'];
const emptyListLabel = `<div>Empty list</div>`;

$(document).ready(() => {
    let fieldModalErrorMessage = '';

    const modalError = $('#modalError');
    modalError.hide();
    const listLoadingSpinner = $('#listLoadingSpinner');
    listLoadingSpinner.css('visibility', 'hidden');

    const addButton = $('#addQuestion');
    const downloadQuestionsButton = $('#downloadQuestionsButton');
    const downloadQuestionsInput = $('#downloadQuestionsInput');
    const addModal = $('#addModal');

    const addModalSubmitButton = $('#addModalSubmitButton');

    const questionModalInput = $('#questionModalInput');
    const answerModalInput = $('#answerModalInput');
    const valueModalInput = $('#valueModalInput');
    const categoryModalInput = $('#categoryModalInput');

    const modalFields = [
        questionModalInput,
        answerModalInput,
        valueModalInput,
        categoryModalInput,
    ];

    const listItemsContainer = $('#listItemsContainer');
    listItemsContainer.prepend(emptyListLabel);

    addModal.on('hidden.bs.modal', () => {
        clearAddModalFields();
    });

    downloadQuestionsButton.on('click', () => {
        downloadQuestionsInput.removeClass('invalidInputValue');
        const inpuntValue = downloadQuestionsInput.val();

        if (inpuntValue < 1 || inpuntValue > 100) {
            downloadQuestionsInput.addClass('invalidInputValue');
            alert(
                'Invalit input value. Please enter a number between 1 and 100'
            );
            return;
        }

        listItemsContainer.hide();
        listLoadingSpinner.css('visibility', 'visible');
        setTimeout(() => {
            getQuestionsCall(inpuntValue);
        }, 1000);
    });

    addButton.on('click', () => {
        addModal.modal('show');
    });

    addModalSubmitButton.on('click', () => {
        const questionObj = {
            question: questionModalInput.val(),
            answer: answerModalInput.val(),
            value: valueModalInput.val(),
            category: categoryModalInput.val(),
            createdAt: new Date(),
        };

        if (!validateNewQuestion(questionObj)) {
            return;
        }

        const newQuestion = getHtmlQuestionElement(questionObj);

        if (listItemsContainer.children()[0].innerHTML === 'Empty list') {
            listItemsContainer.empty();
        }

        listItemsContainer.prepend(newQuestion);
        addModal.modal('hide');
    });

    const onCompleteRequest = () => {
        listLoadingSpinner.css('visibility', 'hidden');
        listItemsContainer.show();
    };

    const getHtmlQuestionElement = (question) => {
        return `<div class="listElement shadow rounded p-3 mb-3">
    <h5>Question</h5>
    <p>
        ${question.question}
    </p>

    <h5>Answer</h5>
    <p>${question.answer}</p>

    <h5>Value</h5>
    <p>${question.value}</p>

    <h5>Created at</h5>
    <p>${question.createdAt}</p>

    <h5>Category</h5>
    <p>${question.category}</p>
</div>`;
    };

    const validateNewQuestion = (element) => {
        const { question, answer, value, category } = element;

        fieldModalErrorMessage = '';
        modalFields.forEach((field) => {
            field.removeClass('invalidInputValue');
        });

        if (typeof question !== 'string' || question.length < 10) {
            fieldModalErrorMessage =
                'Question must be at least 10 characters long';
            questionModalInput.addClass('invalidInputValue');
        }

        if (typeof answer !== 'string' || answer.length < 5) {
            fieldModalErrorMessage =
                'Answer must be at least 5 characters long';
            answerModalInput.addClass('invalidInputValue');
        }

        if (typeof value !== 'string' || value < 50 || value > 150) {
            fieldModalErrorMessage = 'Value must be between 50 and 150';
            valueModalInput.addClass('invalidInputValue');
        }

        if (
            typeof category !== 'string' ||
            CategoryValues.indexOf(category) === -1
        ) {
            fieldModalErrorMessage =
                'Category must be one of the following: ' +
                CategoryValues.join(', ');
            categoryModalInput.addClass('invalidInputValue');
        }

        setErrorState(fieldModalErrorMessage);

        if (fieldModalErrorMessage.length > 0) {
            return false;
        }

        return true;
    };

    const setErrorState = (message) => {
        modalError.text(message);
        if (message.length > 0) {
            modalError.show();
        } else {
            modalError.hide();
        }
    };

    const clearAddModalFields = () => {
        questionModalInput.val('');
        answerModalInput.val('');
        valueModalInput.val('');
        categoryModalInput.val('');
        setErrorState('');
        modalFields.forEach((field) => {
            field.removeClass('invalidInputValue');
        });
    };

    const getQuestionsCall = (noQuestions) => {
        $.ajax({
            url: `${API_URL}${noQuestions}`,
            type: 'GET',
            success: function (data) {
                listItemsContainer.empty();

                data.forEach((element) => {
                    const questionObj = {
                        question: element.question,
                        answer: element.answer,
                        value: element.value,
                        category: element.category.title,
                        createdAt: new Date(element.created_at),
                    };

                    const newQuestion = getHtmlQuestionElement(questionObj);

                    listItemsContainer.prepend(newQuestion);
                });
            },
            error: function (request, error) {
                alert('Request: ' + JSON.stringify(request));
            },
            complete: onCompleteRequest,
        });
    };
});
