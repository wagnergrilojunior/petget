'use client';

import { AuthService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TokenDebug() {
  const handleDebugToken = () => {
    AuthService.debugTokenInfo();
  };

  const handleForceLogout = () => {
    AuthService.forceLogout();
  };

  const handleClearStorage = () => {
    AuthService.clearStorage();
    console.log('localStorage limpo!');
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Debug de Token</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleDebugToken}
          variant="outline"
          className="w-full"
        >
          Mostrar Info do Token
        </Button>
        
        <Button 
          onClick={handleClearStorage}
          variant="secondary"
          className="w-full"
        >
          Limpar localStorage
        </Button>
        
        <Button 
          onClick={handleForceLogout}
          variant="destructive"
          className="w-full"
        >
          Forçar Logout
        </Button>
      </CardContent>
    </Card>
  );
}