import React, {useState, useEffect} from 'react';
import LecturerDashboardLayout from '../components/LecturerDashboardLayout';
import {
  getCategories,
  updateMaterial,
  getMaterialById,
  getQuizQuestionsByMaterialId,
} from '../services/apiService'; // Need a new API function
import {useParams, useNavigate, Link} from 'react-router-dom';

const EditMaterial = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuizEnabled, setIsQuizEnabled] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const materialData = await getMaterialById(id);
        setMaterial(materialData);
        setTitle(materialData.title);
        setDesc(materialData.description || '');
        setSelectedCategory(materialData.category_id);

        const categoriesData = await getCategories();
        setCategories(categoriesData);

        const existingQuizQuestions = await getQuizQuestionsByMaterialId(id);
        if (existingQuizQuestions && existingQuizQuestions.length > 0) {
          setIsQuizEnabled(true);
          setQuizQuestions(
            existingQuizQuestions.map(q => ({
              id: q.id,
              question_text: q.question_text,
              options:
                typeof q.options === 'string'
                  ? q.options.split(',')
                  : q.options,
              correct_answer: q.correct_answer,
              _status: 'existing',
            })),
          );
        } else {
          setQuizQuestions([
            {
              question_text: '',
              options: ['', '', '', ''],
              correct_answer: '',
              _status: 'new',
            },
          ]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load material details.');
        setLoading(false);
        console.error('Error fetching details:', err);
      }
    };

    fetchDetails();
  }, [id]);

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        _status: 'new',
      },
    ]);
  };

  const handleRemoveQuestion = index => {
    const newQuestions = [...quizQuestions];
    if (newQuestions[index]._status === 'existing') {
      newQuestions[index]._status = 'deleted';
    } else {
      newQuestions.splice(index, 1);
    }
    setQuizQuestions(newQuestions.filter(q => q._status !== 'deleted'));
  };

  const handleQuestionChange = (index, event) => {
    const {name, value} = event.target;
    const newQuestions = [...quizQuestions];
    newQuestions[index][name] = value;
    if (newQuestions[index]._status === 'existing') {
      newQuestions[index]._status = 'updated';
    }
    setQuizQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const {value} = event.target;
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].options[optionIndex] = value;
    if (newQuestions[questionIndex]._status === 'existing') {
      newQuestions[questionIndex]._status = 'updated';
    }
    setQuizQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, event) => {
    const {value} = event.target;
    const newQuestions = [...quizQuestions];
    newQuestions[index].correct_answer = value;
    if (newQuestions[index]._status === 'existing') {
      newQuestions[index]._status = 'updated';
    }
    setQuizQuestions(newQuestions);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('category_id', selectedCategory);
    if (file) {
      formData.append('file', file);
    }
    formData.append('isQuizEnabled', isQuizEnabled);
    const questionsToSend = quizQuestions.filter(q => q._status !== 'deleted');
    console.log('Quiz questions being sent:', JSON.stringify(questionsToSend));
    formData.append('quizQuestions', JSON.stringify(questionsToSend));

    try {
      const response = await updateMaterial(id, formData);
      console.log(response.message);
      alert('Update Material Successfully');
      navigate('/lecturer-dashboard');
    } catch (err) {
      console.error('Error updating material:', err);
      alert('Failed to update material.');
    }
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  if (loading) {
    return <p>Loading material details...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!material) {
    return <p>Material not found.</p>;
  }

  return (
    <LecturerDashboardLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Edit Learning Material
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
              value={title}
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
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows="4"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={selectedCategory}
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
              Upload New File (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.mp4,.png,.jpg"
              onChange={handleFileChange}
              className="w-full px-4 py-2 file:border-0 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {material.file_path && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Current File:{' '}
                <a
                  href={`http://localhost:5000${material.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  {material.file_path.split('/').pop()}
                </a>
                (Uploading a new file will replace the current one)
              </p>
            )}
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
                Enable Quiz
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
                  {question.id && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {question.id}
                    </p>
                  )}
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
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    {question._status === 'existing'
                      ? 'Remove Question'
                      : 'Delete Question'}
                  </button>
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
              Update Material
            </button>
          </div>
        </form>
      </div>
    </LecturerDashboardLayout>
  );
};

export default EditMaterial;
