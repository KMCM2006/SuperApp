import { SortWordGame } from './SortWordGame.model';
import { Product } from './Product.model';

describe("Test SortWordGame model", function() {
    let product: Product;
    let sortWordGame: SortWordGame;
    let response: any = [];
    let colorProviderMock;

    beforeEach(function() {
        product = Product.createProduct(1, 'title1', 'image1', 2);
        sortWordGame = new SortWordGame(product, 0);
        colorProviderMock = jasmine.createSpyObj('ArrayColorProvider',['getRandomColor']);

        for (let letter of sortWordGame.ResponseWord) {
            response[letter] = colorProviderMock.getRandomColor();
        }
    });

    afterEach(function() {
        product = null;
        sortWordGame = null;
    });

    it('must return false because is not game over', function() {
        expect(sortWordGame.isGameOver()).toBe(false);
    });

    it('must return true because is game over', function() {
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();
        sortWordGame.addCount();

        expect(sortWordGame.isGameOver()).toBe(true);
    });

    it('must return the product that was used in constructor', function() {
        expect(sortWordGame.Product).toBe(product);
    });

    it('must return the title of product', function() {
        expect(sortWordGame.ResponseWord).toBe(product.Title);
    });

    it('must return messy letters of response word', function() {
        sortWordGame.buildLetters(response);

        expect(sortWordGame.MessyWord).not.toBe(sortWordGame.SortedWord);
    });

    it('must return sorted letters of response word', function() {
        sortWordGame.buildLetters(response);

        for (let i = 0; i < product.Title.length; ++i) {
            expect(product.Title[i]).toBe(sortWordGame.SortedWord[i].letter);
        }
    });

    it('must return messy letters expert', function() {
        sortWordGame.buildLetters(response);

        expect(sortWordGame.MessyWord.length).toEqual(sortWordGame.SortedWord.length + 1);
    });

    it('must set a new product', function() {
        let newProduct: Product;
        newProduct = Product.createProduct(10, 'newTitle', 'newImage', 100);

        sortWordGame.Product = newProduct;

        expect(sortWordGame.Product).toBe(newProduct);
    });
});
