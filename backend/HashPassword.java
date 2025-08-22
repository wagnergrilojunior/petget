import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "123456";
        String hash = encoder.encode(password);
        System.out.println("Hash para senha '" + password + "': " + hash);
        
        // Testa se o hash funciona
        boolean matches = encoder.matches(password, hash);
        System.out.println("Verificação: " + matches);
    }
}