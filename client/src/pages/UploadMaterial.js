import {useState, useEffect} from 'react';
import {getCategories, uploadMaterial} from '../services/apiService';
import LecturerDashboardLayout from '../components/LecturerDashboardLayout';
import {useNavigate, Link} from 'react-router-dom';

const UploadMaterial = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isQuizEnabled, setIsQuizEnabled] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([
    {question_text: '', options: ['', '', '', ''], correct_answer: ''},
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    fetchCategories();
  }, []);
  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {question_text: '', options: ['', '', '', ''], correct_answer: ''},
    ]);
  };

  const handleRemoveQuestion = index => {
    const newQuestions = [...quizQuestions];
    newQuestions.splice(index, 1);
    setQuizQuestions(newQuestions);
  };

  const handleQuestionChange = (index, event) => {
    const {name, value} = event.target;
    const newQuestions = [...quizQuestions];
    newQuestions[index][name] = value;
    setQuizQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const {value} = event.target;
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuizQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, event) => {
    const {value} = event.target;
    const newQuestions = [...quizQuestions];
    newQuestions[index].correct_answer = value;
    setQuizQuestions(newQuestions);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('file', file);
    formData.append('category_id', selectedCategory);
    formData.append('isQuizEnabled', isQuizEnabled);
    if (isQuizEnabled) {
      formData.append('quizQuestions', JSON.stringify(quizQuestions));
    }

    try {
      const response = await uploadMaterial(formData);
      alert('Material uploaded successfully');
      console.log(response);
      navigate('/lecturer-dashboard');
    } catch (err) {
      console.error('Error uploading material:', err);
      alert('Upload failed');
    }
  };

  return (
    <LecturerDashboardLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Upload Learning Material
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Material title"
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description (optional)"
              onChange={e => setDesc(e.target.value)}
              rows="4"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              onChange={e => setSelectedCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.mp4,.png,.jpg"
              onChange={e => setFile(e.target.files[0])}
              required
              className="w-full px-4 py-2 file:border-0 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={isQuizEnabled}
                onChange={e => setIsQuizEnabled(e.target.checked)}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Add a Quiz (Optional)
              </span>
            </label>
          </div>

          {isQuizEnabled && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Quiz Questions
              </h2>
              {quizQuestions.map((question, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">
                    Question {index + 1}
                  </h3>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Question Text
                    </label>
                    <textarea
                      name="question_text"
                      value={question.question_text}
                      onChange={e => handleQuestionChange(index, e)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Option {String.fromCharCode(65 + optionIndex)}
                        </label>
                        <input
                          type="text"
                          value={option}
                          onChange={e =>
                            handleOptionChange(index, optionIndex, e)
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block mt-2 mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correct Answer
                    </label>
                    <select
                      value={question.correct_answer}
                      onChange={e => handleCorrectAnswerChange(index, e)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required>
                      <option value="">Select</option>
                      {question.options.map((_, optionIndex) => (
                        <option
                          key={String.fromCharCode(65 + optionIndex)}
                          value={String.fromCharCode(65 + optionIndex)}>
                          {String.fromCharCode(65 + optionIndex)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {quizQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                      Remove Question
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Add Question
              </button>
            </div>
          )}
          <div className="text-right space-x-4">
            <Link
              to="/lecturer-dashboard"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-xl transition">
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-semibold">
              Upload Material
            </button>
          </div>
        </form>
      </div>
    </LecturerDashboardLayout>
  );
};

export default UploadMaterial;
