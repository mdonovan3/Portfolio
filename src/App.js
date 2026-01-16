import React, { useState } from 'react';
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  Code,
  BarChart3,
  FileText,
  Briefcase,
  Github,
  Linkedin,
  Mail,
  Award,
  Database,
  TrendingUp
} from 'lucide-react';

const Portfolio = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: FileText },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: Code,
      subItems: [
        { id: 'gists', label: 'GitHub Gists', icon: Github },
        { id: 'shiny', label: 'R Shiny Apps', icon: BarChart3 }
      ]
    },
    { 
      id: 'experience', 
      label: 'Experience', 
      icon: Briefcase,
      subItems: [
        { id: 'resume', label: 'Resume', icon: FileText },
        { id: 'skills', label: 'Skills', icon: Award }
      ]
    }
  ];

  const githubGists = [
    { title: 'Data Cleaning Pipeline', url: 'https://gist.github.com/yourusername', description: 'Python script for automated data preprocessing', language: 'Python' },
    { title: 'SQL Query Optimization', url: 'https://gist.github.com/yourusername', description: 'Advanced SQL techniques for performance', language: 'SQL' },
    { title: 'ETL Framework', url: 'https://gist.github.com/yourusername', description: 'Scalable ETL solution using Apache Airflow', language: 'Python' },
    { title: 'Statistical Analysis Functions', url: 'https://gist.github.com/yourusername', description: 'R functions for common statistical tests', language: 'R' }
  ];

  const shinyApps = [
    { title: 'Sales Dashboard', url: 'https://yourapp.shinyapps.io/sales', description: 'Interactive visualization of sales metrics and KPIs' },
    { title: 'Customer Segmentation Tool', url: 'https://yourapp.shinyapps.io/segmentation', description: 'K-means clustering analysis interface' },
    { title: 'Time Series Forecasting', url: 'https://yourapp.shinyapps.io/forecast', description: 'ARIMA and Prophet model comparison tool' },
    { title: 'A/B Test Calculator', url: 'https://yourapp.shinyapps.io/abtest', description: 'Statistical significance testing for experiments' }
  ];

  const skills = {
    'Programming Languages': ['Python', 'R', 'SQL', 'JavaScript', 'Scala'],
    'Data Tools': ['Pandas', 'NumPy', 'Tidyverse', 'dplyr', 'ggplot2'],
    'Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redshift', 'BigQuery'],
    'Cloud & Big Data': ['AWS', 'GCP', 'Spark', 'Hadoop', 'Databricks'],
    'BI & Visualization': ['Tableau', 'Power BI', 'Looker', 'R Shiny', 'Plotly'],
    'ML & Statistics': ['Scikit-learn', 'TensorFlow', 'Statistical Modeling', 'A/B Testing']
  };

  const experience = [
    {
      title: 'Senior Data Engineer',
      company: 'Tech Corp',
      period: '2022 - Present',
      responsibilities: [
        'Architected and implemented cloud-based data pipelines processing 10TB+ daily',
        'Led migration from on-premise to AWS data infrastructure',
        'Optimized query performance reducing costs by 40%'
      ]
    },
    {
      title: 'Data Analyst',
      company: 'Analytics Inc',
      period: '2020 - 2022',
      responsibilities: [
        'Developed executive dashboards using Tableau and R Shiny',
        'Conducted statistical analysis for product optimization',
        'Collaborated with cross-functional teams on data-driven initiatives'
      ]
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'home':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 rounded-lg">
              <h1 className="text-4xl font-bold mb-4">Data Analyst & Engineer</h1>
              <p className="text-xl text-gray-300">Transforming data into actionable insights</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                <Database className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Data Engineering</h3>
                <p className="text-gray-400">Building scalable pipelines and data infrastructure</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-gray-400">Statistical analysis and predictive modeling</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
                <BarChart3 className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Visualization</h3>
                <p className="text-gray-400">Interactive dashboards and reporting</p>
              </div>
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">About Me</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-300 leading-relaxed mb-4">
                I'm a passionate data professional with expertise in both analytics and engineering. 
                With over 5 years of experience, I specialize in building robust data pipelines, 
                performing complex statistical analyses, and creating compelling visualizations that 
                drive business decisions.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                My work spans the entire data lifecycle, from ingestion and transformation to 
                analysis and presentation. I'm proficient in multiple programming languages and 
                cloud platforms, with a strong foundation in statistics and machine learning.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://github.com/yourusername" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
                <a href="https://linkedin.com/in/yourusername" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a href="mailto:your.email@example.com" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                  <Mail className="w-5 h-5" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        );
      
      case 'gists':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Github className="w-8 h-8" />
              GitHub Gists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {githubGists.map((gist, idx) => (
                <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">{gist.title}</h3>
                    <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">{gist.language}</span>
                  </div>
                  <p className="text-gray-400 mb-4">{gist.description}</p>
                  <a href={gist.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    View Gist
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'shiny':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              R Shiny Applications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shinyApps.map((app, idx) => (
                <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                  <h3 className="text-xl font-semibold mb-3">{app.title}</h3>
                  <p className="text-gray-400 mb-4">{app.description}</p>
                  <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                    Launch App
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'resume':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Experience</h2>
            <div className="space-y-6">
              {experience.map((job, idx) => (
                <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{job.title}</h3>
                      <p className="text-blue-400">{job.company}</p>
                    </div>
                    <span className="text-gray-400">{job.period}</span>
                  </div>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="text-gray-300 flex gap-2">
                        <span className="text-blue-400">•</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'skills':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Award className="w-8 h-8" />
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-blue-400">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, idx) => (
                      <span key={idx} className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div 
        className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && <h2 className="font-bold text-lg">Portfolio</h2>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        
        <nav className="p-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleMenu(item.id);
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded hover:bg-gray-700 transition-colors ${
                  activeSection === item.id ? 'bg-gray-700 text-blue-400' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
                {sidebarOpen && item.subItems && (
                  expandedMenus[item.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {sidebarOpen && item.subItems && expandedMenus[item.id] && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveSection(subItem.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition-colors ${
                        activeSection === subItem.id ? 'bg-gray-700 text-blue-400' : ''
                      }`}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span className="text-sm">{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
