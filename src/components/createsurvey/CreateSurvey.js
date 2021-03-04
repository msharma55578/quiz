import React, { useState, useContext } from 'react';
import { SurveyContext } from '../../context/SurveyContext';
import './CreateSurvey.css';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

toast.configure();


const CreateSurvey = (props) => {
    //try empty and remove context
    const [surveyQstns, setSurveyQstns] = useContext(SurveyContext);

    const [surveyType, setSuveyType] = useState('');// For Select Options Value
    const [showSurveyType, setShowSurveyType] = useState(true); //For showing Select Input
    const [multiOptionsCount, setMultiOptionsCount] = useState(0); //Options Count
    const [currMultiQtsn, setCurrMultiQstn] = useState(''); // For MutiSelect Question
    const [currMultiOptions, setCurrMultiOptions] = useState(['']) //For MultiSelect options
    const [showButtons, setShowButtons] = useState(false); // For Showing Add and publish btns
    const [currSingleQtsn, setCurrSingleQstn] = useState(''); //For SingleSelect Question
    const [currSingleOptions, setCurrSingleOptions] = useState(['', '']); //For SngleSlct options

    const [answer, setAnswer]=useState('');
    //Toast Notifications
    const notify = (type, value) => {
        if (type === 'success') {
            toast.success(value, { autoClose: 3000 });
        }

        if (type === 'error') {
            toast.error(value, { autoClose: 3000 });
        }
    }

    //Method to Check Type and create Input Fileds
    const createSurvey = (surveytype) => {
        if (surveytype === 'single-select') {
            return (
                <div className='singleSurvey-container'>
                    <label>Question :</label>
                    <input type='text'
                        placeholder='enter question'
                        className='single-select-input'
                        value={currSingleQtsn}
                        onChange={onSingleSelectQstnChange} />

                    <div className='single-select-input-options'>
                        {currSingleOptions.map((option, index) => {
                            return (
                                <input
                                    key={index}
                                    type='text'
                                    placeholder='option'
                                    value={option}
                                    onChange={(e) => singleOptionChangeHandler(e, index)} />
                            );
                        })}
                    </div>
                </div>
            )
        }
        else if (surveytype === 'multi-select') {
            return (
                <div className='multiSurvey-container'>
                    <label style={{color:'black'}}>Question :</label>
                    <input type='text'
                        placeholder='enter question'
                        className='multi-input'
                        value={currMultiQtsn}
                        onChange={onMultiSelectQstnChange} />
                    <div className='multiOptions-container'>
                        {currMultiOptions.map((option, index) => {
                            return (
                                <div className='option-wrapper' key={index}>
                                    <input
                                        type='text'
                                        placeholder={`option ${index + 1}`}
                                        name={index}
                                        value={currMultiOptions[index]}
                                        onChange={(e) => onMultiSelectOptionChange(e, index)} /> 
                                        <span onClick={incrementOption}>+</span>
                                        <span onClick={decrementOption}>-</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    }
    const createAnswer = (surveytype) => {
        if (surveytype === 'single-select') {
            return (
                <div className='singleSurvey-container' style={{ margin:'auto'}}>
                        <label htmlFor="quantity">Answer option :</label>
                        <input 
                        type="number"  
                        name="quantity" 
                        min="0" 
                        max="1" 
                        placeholder='0-1'
                        onChange={(e) => setAnswer(e.target.value)}
                        />
                </div>
            )
        }
        else  {
            return (
                <div className='singleSurvey-container' style={{ margin:'auto'}}>
                        <label htmlFor="quantity">Answer option :</label>
                        <input 
                        type="number"  
                        name="quantity" 
                        min="0" 
                        max="3" 
                        placeholder='0-3'
                        onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
            );
        }
    }

    const onChangeHandler = (e) => {
        if (e.target.value === 'single-select') {
            setShowButtons(true);
        }
        setSuveyType(e.target.value);
        setShowSurveyType(false);
    }

    //Single Select Input Methods
    const onSingleSelectQstnChange = (e) => {
        // console.log(e.target.value);
        setCurrSingleQstn(e.target.value)
    }

    const singleOptionChangeHandler = (e, index) => {
        // console.log(e.target.value + index);
        let singleOptions = [...currSingleOptions];
        singleOptions[index] = e.target.value;
        setCurrSingleOptions(singleOptions);
    }


    //Multi Select Input Methods
    const incrementOption = () => {
        if (multiOptionsCount < 3) {
            let prevCount = multiOptionsCount;
            prevCount++;
            setMultiOptionsCount(prevCount);
            setCurrMultiOptions(prevOptions => [...prevOptions, '']);
        }
        else {
            notify('error', `Four options are maximum, can't add more options`);
        }
    }

    const decrementOption = () => {
        if (multiOptionsCount > 0) {
            let prevCount = multiOptionsCount;
            prevCount--;
            setMultiOptionsCount(prevCount);
            setCurrMultiOptions(prevOptions => {
                let Options = [...prevOptions];
                Options.pop();
                return Options;
            });
        }
        else {
            notify('error', `One option is minimum, can't remove option`);
        }
    }

    const onMultiSelectQstnChange = (e) => {
        // console.log(e.target.value);
        setCurrMultiQstn(e.target.value);
    }

    const onMultiSelectOptionChange = (e, index) => {
        // console.log(e.target.value);
        let optionValue = e.target.value;
        const options = [...currMultiOptions];
        options[index] = optionValue;
        setCurrMultiOptions(options);
    }

    const addQstnHandler = (surveytype) => {
        if (surveytype === 'single-select') {
            const singleSelectQuestion = currSingleQtsn;
            const singleSelectOptions = currSingleOptions;


            // Check for any empty Field
            if (answer === '' || singleSelectQuestion === '' || singleSelectOptions[0] === '' || singleSelectOptions[1] === '') {
                // console.log('fill all fields to add a question');
                notify('error', 'fill all fields to add a question');
                return;
            }

            const CurrentQuestion = {
                type: surveytype,
                question: singleSelectQuestion,
                options: singleSelectOptions,
                solution: answer
            }

            const AllQuestions = [...surveyQstns];
            AllQuestions.push(CurrentQuestion);
            setSurveyQstns(AllQuestions);
            console.log(setSurveyQstns);
            setCurrSingleQstn('');
            setCurrSingleOptions(['', '']);
            setShowButtons(false);
            setSuveyType('');
            setShowSurveyType(true);
            notify('success', 'Question added successfully');
        }
        else if (surveytype === 'multi-select') {
            const multiQuestion = currMultiQtsn;
            const multiOptions = currMultiOptions;

            // Check for any empty Field
            if (answer === '' || multiQuestion === '' || multiOptions[0] === '' || multiOptions[1] === '' || multiOptions[2] === '' || multiOptions[3] === '') {
                // console.log('fill all fields to add a question');
                notify('error', 'fill all fields to add a question');
                return;
            }


            const CurrentQuestion = {
                type: surveytype,
                question: multiQuestion,
                options: multiOptions,
                solution: answer
            }


            const AllQuestions = [...surveyQstns];
            AllQuestions.push(CurrentQuestion);
            setSurveyQstns(AllQuestions);

            setCurrMultiQstn('');
            setCurrMultiOptions(['']);
            setShowButtons(false);
            setSuveyType('');
            setMultiOptionsCount(0);
            setShowSurveyType(true);
            notify('success', 'Question added successfully');
        }
    }

    const publishQstnHandler = (surveytype) => {
        if (surveytype === 'single-select') {
            //check for empty fields
            if (answer === '' || currSingleQtsn === '' && currSingleOptions[0] === '' && currSingleOptions[1] === '') {
                // console.log('fill all fields to add a question');
                notify('error', 'fill all fields to publish');
                return;
            }


            const CurrentQuestion = {
                type: surveytype,
                question: currSingleQtsn,
                options: currSingleOptions,
                solution: answer
            }

            const AllQuestions = [...surveyQstns];
            AllQuestions.push(CurrentQuestion);
            setSurveyQstns(AllQuestions);

            setCurrSingleQstn('');
            setCurrSingleOptions(['', '']);

            props.history.push('/publish');

        }
        else if (surveytype === 'multi-select') {
            //Check for empty fields
            if (answer === '' || currMultiQtsn === '' || currMultiOptions[0] === '' || currMultiOptions[1] === '' || currMultiOptions[2] === '' || currMultiOptions[3] === '') {
                // console.log('fill all fields to add a question');
                notify('error', 'fill all fields to publish');
                return;
            }

            const CurrentQuestion = {
                type: surveytype,
                question: currMultiQtsn,
                options: currMultiOptions,
                solution: answer
            }


            const AllQuestions = [...surveyQstns];
            AllQuestions.push(CurrentQuestion);
            setSurveyQstns(AllQuestions);

            setCurrMultiQstn('');
            setCurrMultiOptions(['']);

            props.history.push('/publish');
        }
    }

    function Preview(){
        props.history.push('/publish');
    }
    
    function refreshPage() {
        window.location.reload(false);
    }

    return (
        <div className='createSurvey-container'>
            {showSurveyType ? (<div className='input-group'>
                <label htmlFor='survey'>Choose Quiz type : </label>

                <select name='survey' id='survey' onChange={onChangeHandler}>
                    <option value=''>Quiz Type</option>
                    <option value='single-select'>Single-select</option>
                    <option value='multi-select'>Multi-select</option>
                </select>
                {/* <div>
                    <button onClick={() => Preview()}>Preview</button>
                </div> */}
            </div>) : null}
            <div className='add-questions-container'>
                {surveyType === 'multi-select' ? createSurvey('multi-select') : null}
                {surveyType === 'single-select' ? createSurvey('single-select') : null}
            </div>
            {
                multiOptionsCount === 3 || showButtons ? (
                <div>
                    {surveyType === 'single-select' ? createAnswer('single-select') : createAnswer('multi-select')}
                    <div className='btns-wrapper' style={{ margin:'auto'}}>
                            <button onClick={() => addQstnHandler(surveyType)}>Add Question</button>
                            <button onClick={() => publishQstnHandler(surveyType)}>Preview</button>
                    </div>
                    <div className='back-wrapper'>
                        <button onClick={refreshPage}>Back</button>
                    </div>
                </div>) : null
            }
        </div>
    )
}


export default CreateSurvey;