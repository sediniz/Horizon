using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace UnitTests.ServiceTest
{
    [TestClass]
    public class UsuarioServiceTest
    {
        private Mock<IUsuarioRepository> _mockRepository;
        private UsuarioService _usuarioService;

        [TestInitialize]
        public void Setup()
        {
            _mockRepository = new Mock<IUsuarioRepository>();
            _usuarioService = new UsuarioService(_mockRepository.Object);
        }

        
        //[TestMethod]
        //public async Task CriarUsuario_DeveRetornarSucesso_QuandoDadosValidos()
        //{
        //    // Arrange
        //    var usuario = new Usuario { Nome = "João Silva", Email = "joao@email.com" };
        //    _mockRepository.Setup(x => x.AdicionarAsync(It.IsAny<Usuario>())).ReturnsAsync(usuario);

        //    // Act
        //    var resultado = await _usuarioService.CriarUsuarioAsync(usuario);

        //    // Assert
        //    Assert.IsNotNull(resultado);
        //    Assert.AreEqual(usuario.Nome, resultado.Nome);
        //    Assert.AreEqual(usuario.Email, resultado.Email);
        //    _mockRepository.Verify(x => x.AdicionarAsync(It.IsAny<Usuario>()), Times.Once);
        //}

        //[TestMethod]
        //public async Task ObterUsuarioPorId_DeveRetornarUsuario_QuandoIdExiste()
        //{
        //    // Arrange
        //    var usuarioId = 1;
        //    var usuario = new Usuario { Id = usuarioId, Nome = "João Silva", Email = "joao@email.com" };
        //    _mockRepository.Setup(x => x.ObterPorIdAsync(usuarioId)).ReturnsAsync(usuario);

        //    // Act
        //    var resultado = await _usuarioService.ObterUsuarioPorIdAsync(usuarioId);

        //    // Assert
        //    Assert.IsNotNull(resultado);
        //    Assert.AreEqual(usuarioId, resultado.Id);
        //    Assert.AreEqual(usuario.Nome, resultado.Nome);
        //}

        //[TestMethod]
        //public async Task ObterUsuarioPorId_DeveRetornarNull_QuandoIdNaoExiste()
        //{
        //    // Arrange
        //    var usuarioId = 999;
        //    _mockRepository.Setup(x => x.ObterPorIdAsync(usuarioId)).ReturnsAsync((Usuario)null);

        //    // Act
        //    var resultado = await _usuarioService.ObterUsuarioPorIdAsync(usuarioId);

        //    // Assert
        //    Assert.IsNull(resultado);
        //}

        //[TestMethod]
        //public async Task AtualizarUsuario_DeveRetornarSucesso_QuandoDadosValidos()
        //{
        //    // Arrange
        //    var usuario = new Usuario { Id = 1, Nome = "João Silva Atualizado", Email = "joao.novo@email.com" };
        //    _mockRepository.Setup(x => x.AtualizarAsync(It.IsAny<Usuario>())).ReturnsAsync(usuario);

        //    // Act
        //    var resultado = await _usuarioService.AtualizarUsuarioAsync(usuario);

        //    // Assert
        //    Assert.IsNotNull(resultado);
        //    Assert.AreEqual(usuario.Nome, resultado.Nome);
        //    Assert.AreEqual(usuario.Email, resultado.Email);
        //    _mockRepository.Verify(x => x.AtualizarAsync(It.IsAny<Usuario>()), Times.Once);
        //}

        //[TestMethod]
        //public async Task DeletarUsuario_DeveRetornarTrue_QuandoUsuarioExiste()
        //{
        //    // Arrange
        //    var usuarioId = 1;
        //    _mockRepository.Setup(x => x.DeletarAsync(usuarioId)).ReturnsAsync(true);

        //    // Act
        //    var resultado = await _usuarioService.DeletarUsuarioAsync(usuarioId);

        //    // Assert
        //    Assert.IsTrue(resultado);
        //    _mockRepository.Verify(x => x.DeletarAsync(usuarioId), Times.Once);
        //}

        //[TestMethod]
        //public async Task ListarUsuarios_DeveRetornarListaDeUsuarios()
        //{
        //    // Arrange
        //    var usuarios = new List<Usuario>
        //        {
        //            new Usuario { Id = 1, Nome = "João Silva", Email = "joao@email.com" },
        //            new Usuario { Id = 2, Nome = "Maria Santos", Email = "maria@email.com" }
        //        };
        //    _mockRepository.Setup(x => x.ObterTodosAsync()).ReturnsAsync(usuarios);

        //    // Act
        //    var resultado = await _usuarioService.ListarUsuariosAsync();

        //    // Assert
        //    Assert.IsNotNull(resultado);
        //    Assert.AreEqual(2, resultado.Count());
        //    Assert.AreEqual("João Silva", resultado.First().Nome);
        //}

        //[TestMethod]
        //[ExpectedException(typeof(ArgumentException))]
        //public async Task CriarUsuario_DeveLancarExcecao_QuandoEmailInvalido()
        //{
        //    // Arrange
        //    var usuario = new Usuario { Nome = "João Silva", Email = "email-invalido" };

        //    // Act
        //    await _usuarioService.CriarUsuarioAsync(usuario);
        //}

        //[TestMethod]
        //[ExpectedException(typeof(ArgumentNullException))]
        //public async Task CriarUsuario_DeveLancarExcecao_QuandoUsuarioNulo()
        //{
        //    // Act
        //    await _usuarioService.CriarUsuarioAsync(null);
        //}
    }
}
